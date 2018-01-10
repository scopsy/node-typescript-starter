import { Controller, Post, Request, Response } from '@decorators/express';
import { IAppRequest, IAppResponse } from '../../types/app.types';
import { FacebookTokenAuthQueryDto } from './auth.dto';
import { PassportFacebookTokenMiddleware } from './auth.middlewares';

@Controller('/auth')
export class AuthController {

    /**
     * This end point used for authentication with access_token provided
     * Useful when the access_token is obtained via client-side sdk
     */
    @Post('/facebook/token', [ PassportFacebookTokenMiddleware ])
    facebookTokenAuth(
        @Request() req: IAppRequest<any, FacebookTokenAuthQueryDto>,
        @Response() res: IAppResponse
    ) {
        res.json(req.locals.authData);
    }
}

