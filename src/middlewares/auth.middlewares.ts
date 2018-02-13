import { Request } from 'express';
import { IMiddleware, OverrideMiddleware, AuthenticatedMiddleware,
    EndpointInfo, EndpointMetadata, Req
} from 'ts-express-decorators';
import { AuthService } from '../services/auth/auth.service';
import { API_ERRORS } from '../types/app.errors';
import { ApiError } from '../utils/error';

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware implements IMiddleware  {
    constructor(
        private authService: AuthService
    ) {

    }

    async use(@EndpointInfo() endpoint: EndpointMetadata, @Req() request: Request) {
        const token = this.extractHeaderFromRequest(request);
        if (!token) throw new ApiError(API_ERRORS.UNAUTHORIZED);

        request.user = await this.authService.validateToken(token);
    }

    private extractHeaderFromRequest(req: Request): string {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
            return authHeader.split(' ')[1];
        }
    }
}