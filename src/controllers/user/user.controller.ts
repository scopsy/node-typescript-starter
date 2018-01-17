import { Controller, Next, Post, Request, Response } from '@decorators/express';
import { IAppRequest, IAppResponse } from '../../types/app.types';

@Controller('/users', [ /*AuthMiddleware*/ ])
export class UserController {

    @Post('/:id')
    async getUser(@Request() req: IAppRequest, @Response() res: IAppResponse, @Next() next) {
        res.send('Hello World');
    }
}