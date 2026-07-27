import { AppError } from '../../shared/response.js';

export class CustomerService {
  constructor(customerRepository) {
    this.repo = customerRepository;
  }

  async list(organizationId, query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(100, parseInt(query.limit) || 50);
    const skip = (page - 1) * limit;
    const search = query.search;

    return this.repo.findAll(organizationId, { skip, take: limit, search });
  }

  async getById(id, organizationId) {
    const customer = await this.repo.findById(id, organizationId);
    if (!customer) throw AppError.notFound('Customer not found');
    return customer;
  }

  async create(organizationId, data) {
    return this.repo.create({
      ...data,
      organizationId,
    });
  }

  async update(id, organizationId, data) {
    await this.getById(id, organizationId);
    return this.repo.update(id, organizationId, data);
  }

  async delete(id, organizationId) {
    await this.getById(id, organizationId);
    return this.repo.delete(id, organizationId);
  }
}
