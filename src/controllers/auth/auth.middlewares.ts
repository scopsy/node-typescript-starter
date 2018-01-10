import { Middleware } from '@decorators/express';
import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';
import { FACEBOOK_TOKEN_STRATEGY, JWT_STRATEGY, LOCAL_STRATEGY } from '../../services/auth/passport';

export class PassportFacebookTokenMiddleware implements Middleware {
    public use(request: Request, response: Response, next: NextFunction): void {
        return passport.authenticate(FACEBOOK_TOKEN_STRATEGY, {
            session: false
        })(request, response, next);
    }
}

export class PassportLocalAuthMiddleware implements Middleware {
    public use(request: Request, response: Response, next: NextFunction): void {
        return passport.authenticate(LOCAL_STRATEGY, {
            session: false
        })(request, response, next);
    }
}

export class AuthMiddleware implements Middleware  {
    public use(request: Request, response: Response, next: NextFunction): void {
        return passport.authenticate(JWT_STRATEGY, {
            session: false
        })(request, response, next);
    }
}