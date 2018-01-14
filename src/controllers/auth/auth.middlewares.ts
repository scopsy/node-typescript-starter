import { Injectable } from '@decorators/di';
import { Middleware } from '@decorators/express';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { API_ERRORS } from '../../types/app.errors';
import { ApiError } from '../../utils/error';

@Injectable()
export class AuthMiddleware implements Middleware  {
    constructor(private authService: AuthService) {

    }

    async use(request: Request, response: Response, next: NextFunction) {
        const token = this.extractHeaderFromRequest(request);
        if (!token) throw new ApiError(API_ERRORS.UNAUTHORIZED);

        try {
            await this.authService.validateToken(token);
            next();
        } catch (e) {
            next(e);
        }
    }

    private extractHeaderFromRequest(req: Request): string {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
            return authHeader.split(' ')[1];
        }
    }
}