import { Router } from "express";

import { UserController } from './controllers/user.controller';
import { WorkspaceController } from './controllers/workspace.controller';
import { BrandController } from './controllers/brand.controller';
import { ConnectionController } from './controllers/connection.controller';
import { MongooseUsersRepository } from './repositories/users/mongoose-users.repository';
import { MongooseWorkspacesRepository } from './repositories/workspaces/mongoose-workspaces.repository';

const route = Router();

const usersRepository = new MongooseUsersRepository();
const workspacesRepository = new MongooseWorkspacesRepository();

const userController = new UserController(usersRepository);
const workspaceController = new WorkspaceController(workspacesRepository, usersRepository);

route.get('/users', userController.index.bind(userController));
route.get('/users/:id', userController.show.bind(userController));
route.post('/users', userController.create.bind(userController));
route.put('/users/:id', userController.update.bind(userController));
route.delete('/users/:id', userController.delete.bind(userController));




route.get('/workspaces', workspaceController.index.bind(workspaceController));
route.get('/workspaces/:id', workspaceController.show.bind(workspaceController));
route.get('/users/:userId/workspaces', workspaceController.findAllByMemberId.bind(workspaceController));
route.get('/brands/:brandId/workspaces', workspaceController.findByBrandId.bind(workspaceController));

route.post('/workspaces', workspaceController.create.bind(workspaceController));

route.post('/workspaces/:workspaceId/members', workspaceController.addMember.bind(workspaceController));
route.patch('/workspaces/:workspaceId/members/:userId', workspaceController.editRoleMember.bind(workspaceController));
route.patch('/workspaces/:workspaceId/members/:userId/owner', workspaceController.transferOwnerRoleToMember.bind(workspaceController));
route.delete('/workspaces/:workspaceId/members/:userId', workspaceController.removeMember.bind(workspaceController));

route.put('/workspaces/:id', workspaceController.update.bind(workspaceController));
route.delete('/workspaces/:id', workspaceController.delete.bind(workspaceController));

export { route };