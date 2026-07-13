import 'dotenv/config';
import { prisma } from './src/config/database.js';
import bcrypt from 'bcryptjs';
import {
  ENTERPRISE_ROLES,
  ENTERPRISE_ROLE_LEVELS,
  ENTERPRISE_ROLE_HIERARCHY,
} from './src/modules/roles/constants/role.constants.js';

async function main() {
  console.log('🌱 Starting database seeding...');

  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      isActive: true,
    },
  });

  console.log(`🏢 Organization created: ${org.name} (${org.slug})`);

  const rolesMap = {};

  for (const [roleName, level] of Object.entries(ENTERPRISE_ROLE_LEVELS)) {
    const name = ENTERPRISE_ROLES[roleName];
    const parentRoleName = ENTERPRISE_ROLE_HIERARCHY[name];
    const parentRole = parentRoleName ? rolesMap[parentRoleName] : null;

    const role = await prisma.role.upsert({
      where: {
        organizationId_name: {
          organizationId: org.id,
          name,
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        name,
        description: `Enterprise ${name} role`,
        isSystem: true,
        level,
        parentRoleId: parentRole?.id || null,
      },
    });

    rolesMap[name] = role;
    console.log(`👑 Role created: ${name} (Level ${level})`);
  }

  const permissionsData = [
    { name: 'Read Users', slug: 'read:users', moduleName: 'users' },
    { name: 'Create Users', slug: 'create:users', moduleName: 'users' },
    { name: 'Update Users', slug: 'update:users', moduleName: 'users' },
    { name: 'Delete Users', slug: 'delete:users', moduleName: 'users' },
    { name: 'Manage Sessions', slug: 'manage:sessions', moduleName: 'auth' },
    { name: 'Read Organization', slug: 'organization:read', moduleName: 'organization' },
    { name: 'Create Organization', slug: 'organization:create', moduleName: 'organization' },
    { name: 'Update Organization', slug: 'organization:update', moduleName: 'organization' },
    { name: 'Delete Organization', slug: 'organization:delete', moduleName: 'organization' },
    { name: 'Read Companies', slug: 'company:read', moduleName: 'organization' },
    { name: 'Create Company', slug: 'company:create', moduleName: 'organization' },
    { name: 'Update Company', slug: 'company:update', moduleName: 'organization' },
    { name: 'Delete Company', slug: 'company:delete', moduleName: 'organization' },
    { name: 'Read Branches', slug: 'branch:read', moduleName: 'organization' },
    { name: 'Create Branch', slug: 'branch:create', moduleName: 'organization' },
    { name: 'Update Branch', slug: 'branch:update', moduleName: 'organization' },
    { name: 'Delete Branch', slug: 'branch:delete', moduleName: 'organization' },
    { name: 'Read Departments', slug: 'department:read', moduleName: 'organization' },
    { name: 'Create Department', slug: 'department:create', moduleName: 'organization' },
    { name: 'Update Department', slug: 'department:update', moduleName: 'organization' },
    { name: 'Delete Department', slug: 'department:delete', moduleName: 'organization' },
    { name: 'Read Territories', slug: 'territory:read', moduleName: 'organization' },
    { name: 'Create Territory', slug: 'territory:create', moduleName: 'organization' },
    { name: 'Update Territory', slug: 'territory:update', moduleName: 'organization' },
    { name: 'Delete Territory', slug: 'territory:delete', moduleName: 'organization' },
    { name: 'Read Leads', slug: 'lead:read', moduleName: 'lead-management' },
    { name: 'Create Leads', slug: 'lead:create', moduleName: 'lead-management' },
    { name: 'Update Leads', slug: 'lead:update', moduleName: 'lead-management' },
    { name: 'Delete Leads', slug: 'lead:delete', moduleName: 'lead-management' },
    { name: 'Export Leads', slug: 'lead:export', moduleName: 'lead-management' },
    { name: 'Read Orders', slug: 'order:read', moduleName: 'sales-order' },
    { name: 'Create Orders', slug: 'order:create', moduleName: 'sales-order' },
    { name: 'Update Orders', slug: 'order:update', moduleName: 'sales-order' },
    { name: 'Delete Orders', slug: 'order:delete', moduleName: 'sales-order' },
    { name: 'Approve Orders', slug: 'order:approve', moduleName: 'sales-order' },
    { name: 'Read Attendance', slug: 'attendance:read', moduleName: 'field-force' },
    { name: 'Check In/Out', slug: 'attendance:write', moduleName: 'field-force' },
    { name: 'Read Visits', slug: 'visit:read', moduleName: 'field-force' },
    { name: 'Manage Visits', slug: 'visit:write', moduleName: 'field-force' },
    { name: 'Read Expenses', slug: 'expense:read', moduleName: 'field-force' },
    { name: 'Log Expenses', slug: 'expense:write', moduleName: 'field-force' },
    { name: 'Approve Expenses', slug: 'expense:approve', moduleName: 'field-force' },
  ];

  const createdPermissions = [];
  const adminRole = rolesMap[ENTERPRISE_ROLES.ORGANIZATION_ADMINISTRATOR];

  for (const permData of permissionsData) {
    const permission = await prisma.permission.upsert({
      where: { slug: permData.slug },
      update: {},
      create: permData,
    });
    createdPermissions.push(permission);

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(`🔒 Seeded ${createdPermissions.length} permissions and mapped to Organization Administrator`);

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: org.id,
        email: 'admin@acme-corp.com',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@acme-corp.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`👤 Admin User created: ${user.email}`);

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  await prisma.passwordHistory.create({
    data: {
      userId: user.id,
      passwordHash,
    },
  });

  console.log('🔑 Password history seeded.');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
