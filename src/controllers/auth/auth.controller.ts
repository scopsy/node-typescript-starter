import { NextFunction } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { AUTH_STRATEGY } from '../../services/auth/passport/passport.service';
import { IAppRequest, IAppResponse } from '../../types/app.types';
import { ApiError } from '../../utils/error';
import { FacebookTokenAuthQueryDto, LocalLoginDto, SignupDto } from './auth.dto';
import {
    Request, BodyParams,
    Controller, Post, Response, Next
} from 'ts-express-decorators';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post('/login')
    async login(@Request() req: IAppRequest<LocalLoginDto>, @Response() res, @Next() next: NextFunction) {
        const auth = await this.authService.authenticateStrategy(AUTH_STRATEGY.LOCAL_STRATEGY, req, res, next);

        res.json(auth);
    }

    @Post('/signup')
    async signup(@BodyParams() data: SignupDto) {
        if (!data.firstName) throw new ApiError('firstName must be provided', 400);
        if (!data.lastName) throw new ApiError('lastName must be provided', 400);
        if (!data.password) throw new ApiError('password must be provided', 400);
        if (!data.email) throw new ApiError('email must be provided', 400);

        const user = await this.authService.createUser(data);
        const authData = await this.authService.authenticateLocal(user.email, data.password);

        return authData;
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

