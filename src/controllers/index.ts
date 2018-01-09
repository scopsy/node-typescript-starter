import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';

export const APP_CONTROLLERS = [
    UserController,
    AuthController
];

export * from './user/user.controller';
export * from './auth/auth.controller';