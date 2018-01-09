import { Injectable } from '@decorators/di';
import { ErrorMiddleware } from '@decorators/express';

@Injectable()
export class ServerErrorMiddleware implements ErrorMiddleware {
    constructor() {}

    public use(error, req, res, next) {
        const { status, code, message } = error;

        res.status(status || 500).json({
            message,
            status,
            code
        });
    }
}
