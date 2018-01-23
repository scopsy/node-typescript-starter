import { NextFunction } from 'express';
import {
    BodyParams, Controller, Next, Post, QueryParams, Request, Required, Response,
    Status
} from 'ts-express-decorators';
import { Returns } from 'ts-express-decorators/lib/swagger';
import { Validate, Validator } from 'typescript-param-validator';
import { AuthDto } from '../../services/auth/auth.dto';
import { AuthService } from '../../services/auth/auth.service';
import { AUTH_STRATEGY } from '../../services/auth/passport/passport.service';
import { IAppRequest, IAppResponse } from '../../types/app.types';
import { HTTPStatusCodes } from '../../types/http';
import { FacebookTokenAuthQueryDto, LocalLoginDto, SignupDto } from './auth.dto';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post('/login')
    @Returns(AuthDto)
    @Validate()
    async login(
        @Validator() @BodyParams() body: LocalLoginDto,
        @Request() req: any,
        @Response() res,
        @Next() next: NextFunction
    ) {
        const auth = await this.authService.authenticateStrategy(AUTH_STRATEGY.LOCAL_STRATEGY, req, res, next);

        res.json(auth);
    }

    @Post('/signup')
    @Returns(AuthDto)
    @Status(HTTPStatusCodes.CREATED)
    @Validate()
    async signup(
        @Validator() @BodyParams() data: SignupDto
    ) {
        const user = await this.authService.createUser(data);
        const authData = await this.authService.authenticateLocal(user.email, data.password);

        return authData;
    }

    /**
     * This end point used for authentication with fb access_token provided
     * Useful when the access_token is obtained via client-side sdk
     */
    @Post('/facebook/token')
    @Returns(AuthDto)
    async facebookTokenAuth(
        @Required() @QueryParams('access_token') token: string,
        @Request() req: IAppRequest<any, FacebookTokenAuthQueryDto>,
        @Response() res: IAppResponse,
        @Next() next: NextFunction
    ) {
        const auth = await this.authService.authenticateStrategy(AUTH_STRATEGY.FACEBOOK_TOKEN_STRATEGY, req, res, next);

        res.json(auth);
    }
}

