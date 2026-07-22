import { AppError } from '../../../shared/response.js';
import { logAudit } from '../../../utils/audit.js';
import { CompanyRepository } from '../repositories/companyRepository.js';
import { BranchRepository } from '../repositories/BranchRepository.js';
import { DepartmentRepository } from '../repositories/DepartmentRepository.js';
import { TerritoryRepository } from '../repositories/TerritoryRepository.js';

/**
 * Organization Service
 * Business logic for Organization, Company, Branch, Department, Territory
 */
export class OrganizationService {
  constructor(organizationRepository) {
    this.repo = organizationRepository;
    this.companyRepo = new CompanyRepository();
    this.branchRepo = new BranchRepository();
    this.departmentRepo = new DepartmentRepository();
    this.territoryRepo = new TerritoryRepository();
  }

  // --------------------------------------------------
  // Shared
  // --------------------------------------------------

  _buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  _buildListOptions({ page, limit, search, sortBy, sortOrder }) {
    const skip = (page - 1) * limit;
    const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'slug', 'isActive'];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    return { skip, take: limit, search, sortBy: resolvedSortBy, sortOrder };
  }

  async _rejectSoftDelete(entityName, entityId, organizationId, req) {
    await logAudit({
      organizationId,
      userId: req.user.id,
      action: `${entityName.toLowerCase()}.delete.rejected`,
      moduleName: 'organization',
      details: { entityId, reason: 'Soft delete fields unavailable in Prisma schema.' },
      req,
    });

    throw AppError.conflict(
      `${entityName} cannot be deleted because the current Prisma schema does not provide soft-delete fields for this resource.`
    );
  }

  // --------------------------------------------------
  // Organization
  // --------------------------------------------------

  async listOrganizations(query) {
    const options = this._buildListOptions(query);
    const { organizations, total } = await this.repo.findAll({
      ...options,
      isActive: query.isActive,
    });
    return { 
      organizations, 
      meta: this._buildPaginationMeta(total, query.page, query.limit) 
    };
  }

  async getOrganization(organizationId) {
    const org = await this.repo.findById(organizationId);
    if (!org) throw AppError.notFound('Organization not found.');
    return org;
  }

  async createOrganization(data, req) {
    if (await this.repo.existsByName(data.name)) {
      throw AppError.badRequest(`Organization name '${data.name}' is already in use.`);
    }

    const slug = this._generateSlug(data.name);
    let uniqueSlug = slug;
    let counter = 1;
    
    while (await this.repo.existsBySlug(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const organizationData = {
      ...data,
      slug: uniqueSlug,
      isActive: data.isActive ?? true,
    };

    const organization = await this.repo.create(organizationData);

    await logAudit({
      organizationId: organization.id,
      userId: req.user?.id || null,
      action: 'organization.create',
      moduleName: 'organization',
      details: { 
        organizationId: organization.id, 
        name: organization.name,
        slug: organization.slug 
      },
      req,
    });

    return organization;
  }

  _generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async updateOrganization(organizationId, data, req) {
    const org = await this.repo.findById(organizationId);
    if (!org) throw AppError.notFound('Organization not found.');

    if (data.name && data.name !== org.name) {
      if (await this.repo.existsByName(data.name, organizationId)) {
        throw AppError.badRequest(`Organization name '${data.name}' is already in use.`);
      }
      
      const slug = this._generateSlug(data.name);
      let uniqueSlug = slug;
      let counter = 1;
      
      while (await this.repo.existsBySlug(uniqueSlug, organizationId)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      
      data.slug = uniqueSlug;
    }

    const updated = await this.repo.update(organizationId, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'organization.update',
      moduleName: 'organization',
      details: { changes: data },
      req,
    });

    return updated;
  }

  async activateOrganization(organizationId, req) {
    const org = await this.repo.findById(organizationId);
    if (!org) throw AppError.notFound('Organization not found.');
    
    if (org.isActive) {
      throw AppError.badRequest('Organization is already active.');
    }

    const updated = await this.repo.update(organizationId, { isActive: true });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'organization.activate',
      moduleName: 'organization',
      details: { organizationId, previousStatus: false },
      req,
    });

    return updated;
  }

  async deactivateOrganization(organizationId, req) {
    const org = await this.repo.findById(organizationId);
    if (!org) throw AppError.notFound('Organization not found.');
    
    if (!org.isActive) {
      throw AppError.badRequest('Organization is already inactive.');
    }

    // Business Rule: Cannot deactivate if active users exist
    const statistics = await this.repo.getStatistics(organizationId);
    if (statistics.users.active > 0) {
      throw AppError.conflict('Cannot deactivate organization while active users exist. Please deactivate all users first.');
    }

    const updated = await this.repo.update(organizationId, { isActive: false });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'organization.deactivate',
      moduleName: 'organization',
      details: { organizationId, previousStatus: true },
      req,
    });

    return updated;
  }

  async deleteOrganization(organizationId, req) {
    const org = await this.repo.findById(organizationId);
    if (!org) throw AppError.notFound('Organization not found.');

    // Business Rule: Cannot delete if active companies exist
    const statistics = await this.repo.getStatistics(organizationId);
    if (statistics.companies > 0) {
      throw AppError.conflict('Cannot delete organization while companies exist. Please delete all companies first.');
    }

    const deleted = await this.repo.delete(organizationId);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'organization.delete',
      moduleName: 'organization',
      details: { organizationId, name: org.name },
      req,
    });

    return deleted;
  }

  async getStatistics(organizationId, req) {
    const org = await this.repo.findById(organizationId);
    if (!org) throw AppError.notFound('Organization not found.');

    const statistics = await this.repo.getStatistics(organizationId);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'organization.statistics.view',
      moduleName: 'organization',
      details: { organizationId },
      req,
    });

    return {
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        isActive: org.isActive,
      },
      statistics,
    };
  }

  // --------------------------------------------------
  // Company
  // --------------------------------------------------

  async listCompanies(organizationId, query) {
    const options = this._buildListOptions(query);
    const { companies, total } = await this.companyRepo.findAll(organizationId, options);
    return { companies, meta: this._buildPaginationMeta(total, query.page, query.limit) };
  }

  async getCompany(id, organizationId) {
    const company = await this.companyRepo.findById(id, organizationId);
    if (!company) throw AppError.notFound('Company not found.');
    return company;
  }

  async createCompany(organizationId, data, req) {
    // Enforce code uniqueness within organization
    if (data.code) {
      const existing = await this.companyRepo.findByCode(organizationId, data.code);
      if (existing) throw AppError.badRequest(`Company code '${data.code}' is already in use.`);
    }

    const company = await this.companyRepo.create({ ...data, organizationId });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'company.create',
      moduleName: 'organization',
      details: { companyId: company.id, name: company.name },
      req,
    });

    return company;
  }

  async updateCompany(id, organizationId, data, req) {
    const company = await this.companyRepo.findById(id, organizationId);
    if (!company) throw AppError.notFound('Company not found.');

    // Code uniqueness check — skip if code unchanged
    if (data.code && data.code !== company.code) {
      const existing = await this.companyRepo.findByCode(organizationId, data.code);
      if (existing) throw AppError.badRequest(`Company code '${data.code}' is already in use.`);
    }

    const updated = await this.companyRepo.update(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'company.update',
      moduleName: 'organization',
      details: { companyId: id, changes: data },
      req,
    });

    return updated;
  }

  async deleteCompany(id, organizationId, req) {
    const company = await this.companyRepo.findById(id, organizationId);
    if (!company) throw AppError.notFound('Company not found.');

    if (company._count.branches > 0) {
      throw AppError.conflict('Cannot delete company while branches exist.');
    }

    // await this._rejectSoftDelete('Company', id, organizationId, req);

const deleted = await this.companyRepo.softDelete(
  id,
  req.user.id
);

await logAudit({
  organizationId,
  userId: req.user.id,
  action: 'company.delete',
  moduleName: 'organization',
  details: {
    companyId: id,
    name: company.name,
  },
  req,
});

return deleted;

  }
  // async restoreCompany(id, organizationId, req) {
  //   const company = await this.companyRepo.findById(id, organizationId);
  //   if (!company) throw AppError.notFound('Company not found.');

  //   await logAudit({
  //     organizationId,
  //     userId: req.user.id,
  //     action: 'company.restore.rejected',
  //     moduleName: 'organization',
  //     details: { companyId: id, reason: 'Soft delete fields unavailable in Prisma schema.' },
  //     req,
  //   });

  //   throw AppError.conflict('Company restore is unavailable because the current Prisma schema does not provide soft-delete fields.');
  // }

  async restoreCompany(id, organizationId, req) {
  const company = await this.companyRepo.restore(id);

  await logAudit({
    organizationId,
    userId: req.user.id,
    action: 'company.restore',
    moduleName: 'organization',
    details: {
      companyId: id,
    },
    req,
  });

  return company;
}

  // --------------------------------------------------
  // Branch
  // --------------------------------------------------

  async listBranches(organizationId, query) {
    const options = this._buildListOptions(query);
    const { branches, total } = await this.branchRepo.findAll(organizationId, {
      ...options,
      companyId: query.companyId,
    });
    return { branches, meta: this._buildPaginationMeta(total, query.page, query.limit) };
  }

  async getBranch(id, organizationId) {
    const branch = await this.branchRepo.findById(id, organizationId);
    if (!branch) throw AppError.notFound('Branch not found.');
    return branch;
  }

  async createBranch(organizationId, data, req) {
    // Verify company belongs to this organization
    const companyExists = await this.companyRepo.belongsToOrganization(data.companyId, organizationId);
    if (!companyExists) throw AppError.badRequest('Company not found within your organization.');

    // Code uniqueness within the company
    if (data.code) {
      const existing = await this.branchRepo.findByCode(data.companyId, data.code);
      if (existing) throw AppError.badRequest(`Branch code '${data.code}' is already in use within this company.`);
    }

    const branch = await this.branchRepo.create(data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'branch.create',
      moduleName: 'organization',
      details: { branchId: branch.id, name: branch.name, companyId: data.companyId },
      req,
    });

    return branch;
  }

  async updateBranch(id, organizationId, data, req) {
    const branch = await this.branchRepo.findById(id, organizationId);
    if (!branch) throw AppError.notFound('Branch not found.');

    if (data.code && data.code !== branch.code) {
      const existing = await this.branchRepo.findByCode(branch.companyId, data.code);
      if (existing) throw AppError.badRequest(`Branch code '${data.code}' is already in use within this company.`);
    }

    const updated = await this.branchRepo.update(id, data);
    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'branch.update',
      moduleName: 'organization',
      details: { branchId: id, changes: data },
      req,
    });

    return updated;
  }

  async deleteBranch(id, organizationId, req) {
    const branch = await this.branchRepo.findById(id, organizationId);
    if (!branch) throw AppError.notFound('Branch not found.');

    const activeUserCount = await this.branchRepo.countActiveUsers(id);
    if (activeUserCount > 0) {
      throw AppError.conflict('Cannot delete branch while active users exist.');
    }

    // await this._rejectSoftDelete('Branch', id, organizationId, req);

const deleted = await this.branchRepo.softDelete(
  id,
  req.user.id
);

await logAudit({
  organizationId,
  userId: req.user.id,
  action: 'branch.delete',
  moduleName: 'organization',
  details: {
    branchId: id,
    name: branch.name,
    companyId: branch.companyId,
  },
  req,
});

return deleted;

  }

  // async restoreBranch(id, organizationId, req) {
  //   const branch = await this.branchRepo.findById(id, organizationId);
  //   if (!branch) throw AppError.notFound('Branch not found.');

  //   await logAudit({
  //     organizationId,
  //     userId: req.user.id,
  //     action: 'branch.restore.rejected',
  //     moduleName: 'organization',
  //     details: { branchId: id, reason: 'Soft delete fields unavailable in Prisma schema.' },
  //     req,
  //   });

  //   throw AppError.conflict('Branch restore is unavailable because the current Prisma schema does not provide soft-delete fields.');
  // }

  // --------------------------------------------------
  // Department
  // --------------------------------------------------


  async restoreBranch(id, organizationId, req) {
  const branch = await this.branchRepo.restore(id);

  await logAudit({
    organizationId,
    userId: req.user.id,
    action: 'branch.restore',
    moduleName: 'organization',
    details: {
      branchId: id,
    },
    req,
  });

  return branch;
}
  async listDepartments(organizationId, query) {
    const options = this._buildListOptions(query);
    const { departments, total } = await this.departmentRepo.findAll(organizationId, {
      ...options,
      branchId: query.branchId,
    });
    return { departments, meta: this._buildPaginationMeta(total, query.page, query.limit) };
  }

  async getDepartment(id, organizationId) {
    const department = await this.departmentRepo.findById(id, organizationId);
    if (!department) throw AppError.notFound('Department not found.');
    return department;
  }

  async createDepartment(organizationId, data, req) {
    const branchExists = await this.branchRepo.belongsToOrganization(data.branchId, organizationId);
    if (!branchExists) throw AppError.badRequest('Branch not found within your organization.');

    if (data.code) {
      const existing = await this.departmentRepo.findByCode(data.branchId, data.code);
      if (existing) throw AppError.badRequest(`Department code '${data.code}' is already in use within this branch.`);
    }

    const department = await this.departmentRepo.create(data);
    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'department.create',
      moduleName: 'organization',
      details: { departmentId: department.id, name: department.name, branchId: data.branchId },
      req,
    });

    return department;
  }

  async updateDepartment(id, organizationId, data, req) {
    const department = await this.departmentRepo.findById(id, organizationId);
    if (!department) throw AppError.notFound('Department not found.');

    if (data.code && data.code !== department.code) {
      const existing = await this.departmentRepo.findByCode(department.branchId, data.code);
      if (existing) throw AppError.badRequest(`Department code '${data.code}' is already in use within this branch.`);
    }

    const updated = await this.departmentRepo.update(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'department.update',
      moduleName: 'organization',
      details: { departmentId: id, changes: data },
      req,
    });

    return updated;
  }

  async deleteDepartment(id, organizationId, req) {
    const department = await this.departmentRepo.findById(id, organizationId);
    if (!department) throw AppError.notFound('Department not found.');

    if (department._count.users > 0 || department._count.teams > 0) {
      throw AppError.conflict('Cannot delete department while users or teams are assigned.');
    }

    // await this._rejectSoftDelete('Department', id, organizationId, req);

    const deleted = await this.departmentRepo.softDelete(
  id,
  req.user.id
);

await logAudit({
  organizationId,
  userId: req.user.id,
  action: 'department.delete',
  moduleName: 'organization',
  details: {
    departmentId: id,
    name: department.name,
    branchId: department.branchId,
  },
  req,
});

return deleted;
  }

  // async restoreDepartment(id, organizationId, req) {
  //   const department = await this.departmentRepo.findById(id, organizationId);
  //   if (!department) throw AppError.notFound('Department not found.');

  //   await logAudit({
  //     organizationId,
  //     userId: req.user.id,
  //     action: 'department.restore.rejected',
  //     moduleName: 'organization',
  //     details: { departmentId: id, reason: 'Soft delete fields unavailable in Prisma schema.' },
  //     req,
  //   });

  //   throw AppError.conflict('Department restore is unavailable because the current Prisma schema does not provide soft-delete fields.');
  // }
  // --------------------------------------------------
  // Territory
  // --------------------------------------------------


  async restoreDepartment(id, organizationId, req) {
  const department = await this.departmentRepo.restore(id);

  await logAudit({
    organizationId,
    userId: req.user.id,
    action: 'department.restore',
    moduleName: 'organization',
    details: {
      departmentId: id,
    },
    req,
  });

  return department;
}


  async listTerritories(organizationId, query) {
    const options = this._buildListOptions(query);
    const { territories, total } = await this.territoryRepo.findAll(organizationId, {
      ...options,
      companyId: query.companyId,
    });
    return { territories, meta: this._buildPaginationMeta(total, query.page, query.limit) };
  }

  async getTerritory(id, organizationId) {
    const territory = await this.territoryRepo.findById(id, organizationId);
    if (!territory) throw AppError.notFound('Territory not found.');
    return territory;
  }

  async createTerritory(organizationId, data, req) {
    if (data.companyId) {
      const companyExists = await this.companyRepo.belongsToOrganization(data.companyId, organizationId);
      if (!companyExists) throw AppError.badRequest('Company not found within your organization.');
    }

    const territory = await this.territoryRepo.create({ ...data, organizationId });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'territory.create',
      moduleName: 'organization',
      details: { territoryId: territory.id, name: territory.name },
      req,
    });

    return territory;
  }

  async updateTerritory(id, organizationId, data, req) {
    const territory = await this.territoryRepo.findById(id, organizationId);
    if (!territory) throw AppError.notFound('Territory not found.');

    if (data.companyId) {
      const companyExists = await this.companyRepo.belongsToOrganization(data.companyId, organizationId);
      if (!companyExists) throw AppError.badRequest('Company not found within your organization.');
    }

    const updated = await this.territoryRepo.update(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'territory.update',
      moduleName: 'organization',
      details: { territoryId: id, changes: data },
      req,
    });

    return updated;
  }

  async deleteTerritory(id, organizationId, req) {
    const territory = await this.territoryRepo.findById(id, organizationId);
    if (!territory) throw AppError.notFound('Territory not found.');

    if (territory._count.teams > 0 || territory._count.users > 0) {
      throw AppError.conflict('Cannot delete territory while teams or users are assigned.');
    }

    // await this._rejectSoftDelete('Territory', id, organizationId, req);

    const deleted = await this.territoryRepo.softDelete(
  id,
  req.user.id
);

await logAudit({
  organizationId,
  userId: req.user.id,
  action: 'territory.delete',
  moduleName: 'organization',
  details: {
    territoryId: id,
    name: territory.name,
    companyId: territory.companyId,
  },
  req,
});

return deleted;
  }
  
  // async restoreTerritory(id, organizationId, req) {
  //   const territory = await this.territoryRepo.findById(id, organizationId);
  //   if (!territory) throw AppError.notFound('Territory not found.');

  //   await logAudit({
  //     organizationId,
  //     userId: req.user.id,
  //     action: 'territory.restore.rejected',
  //     moduleName: 'organization',
  //     details: { territoryId: id, reason: 'Soft delete fields unavailable in Prisma schema.' },
  //     req,
  //   });

  //   throw AppError.conflict('Territory restore is unavailable because the current Prisma schema does not provide soft-delete fields.');
  // }
  async restoreTerritory(id, organizationId, req) {
  const territory = await this.territoryRepo.restore(id);

  await logAudit({
    organizationId,
    userId: req.user.id,
    action: 'territory.restore',
    moduleName: 'organization',
    details: {
      territoryId: id,
    },
    req,
  });

  return territory;
}
}
