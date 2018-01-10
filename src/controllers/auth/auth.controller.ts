import { Body, Controller, Post, Request, Response } from '@decorators/express';
import { AuthService } from '../../services/auth/auth.service';
import { IAppRequest, IAppResponse } from '../../types/app.types';
import { ApiError } from '../../utils/error';
import { UnexpectedError } from '../../utils/error/UnexpectedError';
import { FacebookTokenAuthQueryDto, LocalLoginDto, SignupDto } from './auth.dto';
import {
    PassportFacebookTokenMiddleware,
    PassportLocalAuthMiddleware
} from './auth.middlewares';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    /**
     * Providers user login using email and password.
     */
    @Post('/login', [ PassportLocalAuthMiddleware ])
    login(@Request() req: IAppRequest<LocalLoginDto>, @Response() res: IAppResponse) {
        if (!req.locals || !res.locals.authData) throw new UnexpectedError();

        res.json(req.locals.authData);
    }

    @Post('/signup')
    async signup(@Body() data: SignupDto, @Response() res: IAppResponse) {
        if (!data.firstName) throw new ApiError('firstName must be provided');
        if (!data.lastName) throw new ApiError('lastName must be provided');
        if (!data.password) throw new ApiError('password must be provided');
        if (!data.email) throw new ApiError('email must be provided');

        await this.authService.createUser(data);

        const authData = await this.authService.authenticateLocal(data.email, data.password);
        res.json(authData);
    }

    /**
     * This end point used for authentication with fb access_token provided
     * Useful when the access_token is obtained via client-side sdk
     */
    @Post('/facebook/token', [ PassportFacebookTokenMiddleware ])
    facebookTokenAuth(
        @Request() req: IAppRequest<any, FacebookTokenAuthQueryDto>,
        @Response() res: IAppResponse
    ) {
        if (!req.locals || !res.locals.authData) throw new UnexpectedError();

        res.json(req.locals.authData);
    }
}

