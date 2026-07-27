import { Router } from 'express';
import { CustomerController } from './customers.controller.js';
import { CustomerService } from './customers.service.js';
import { CustomerRepository } from './customers.repository.js';
import { authenticate, requireOrganization } from '../../middlewares/auth.middleware.js';

const router = Router();

const repo = new CustomerRepository();
const service = new CustomerService(repo);
const controller = new CustomerController(service);

router.use(authenticate, requireOrganization);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
