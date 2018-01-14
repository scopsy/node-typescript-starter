import { Injectable } from '@decorators/di';
import { Body, Controller, Next, Post, Request, Response } from '@decorators/express';
import { NextFunction } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { AUTH_STRATEGY } from '../../services/auth/passport/passport.service';
import { IAppRequest, IAppResponse } from '../../types/app.types';
import { ApiError } from '../../utils/error';
import { FacebookTokenAuthQueryDto, LocalLoginDto, SignupDto } from './auth.dto';

@Controller('/auth')
@Injectable()
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post('/login')
    async login(@Request() req: IAppRequest<LocalLoginDto>, @Response() res: IAppResponse, @Next() next: NextFunction) {
        const auth = await this.authService.authenticateStrategy(AUTH_STRATEGY.LOCAL_STRATEGY, req, res, next);

        res.json(auth);
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
    @Post('/facebook/token')
    async facebookTokenAuth(
        @Request() req: IAppRequest<any, FacebookTokenAuthQueryDto>,
        @Response() res: IAppResponse,
        @Next() next: NextFunction
    ) {
        const auth = await this.authService.authenticateStrategy(AUTH_STRATEGY.FACEBOOK_TOKEN_STRATEGY, req, res, next);

        res.json(auth);
    }
}

