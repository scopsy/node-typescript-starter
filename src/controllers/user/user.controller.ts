import { Controller, Get, Request, Response } from '@decorators/express';
import { IAppRequest, IAppResponse } from '../../types/app.types';
import { AuthMiddleware } from '../auth/auth.middlewares';

@Controller('/users', [ AuthMiddleware ])
export class UserController {

    @Get('/:id')
    async getUser(@Request() req: IAppRequest, @Response() res: IAppResponse) {
        res.send('Hello World');
    }
}