import express from 'express';
import { authenticate, requireOrganization, authorize } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validation.middleware.js';
import { TeamRepository } from './team.repository.js';
import { TeamService } from './team.service.js';
import { TeamController } from './team.controller.js';
import {
  listQuerySchema,
  createTeamSchema,
  updateTeamSchema,
  idParamSchema,
} from './team.validation.js';
import TEAM_PERMISSIONS from './team.permission.js';

const router = express.Router();

const teamRepository = new TeamRepository();
const teamService = new TeamService(teamRepository);
const teamController = new TeamController(teamService);

router.use(authenticate, requireOrganization);

const P = TEAM_PERMISSIONS;

router.get('/', authorize(P.READ), validate(listQuerySchema, 'query'), teamController.listTeams);
router.post('/', authorize(P.CREATE), validate(createTeamSchema, 'body'), teamController.createTeam);
router.get('/:id', authorize(P.READ), validate(idParamSchema, 'params'), teamController.getTeam);
router.put('/:id', authorize(P.UPDATE), validate(idParamSchema, 'params'), validate(updateTeamSchema, 'body'), teamController.updateTeam);
router.delete('/:id', authorize(P.DELETE), validate(idParamSchema, 'params'), teamController.deleteTeam);
router.patch('/:id/restore', authorize(P.UPDATE), validate(idParamSchema, 'params'), teamController.restoreTeam);

export default router;
export { teamController, teamService, teamRepository };
