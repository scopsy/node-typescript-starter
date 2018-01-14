import { Injectable } from '@decorators/di';
import { ErrorMiddleware } from '@decorators/express';
import { ApiError } from '../utils/error';

export interface IApiErrorResponse {
    code: number;
    status: number;
    message: string;
    stack?: string;
}

@Injectable()
export class ServerErrorMiddleware implements ErrorMiddleware {
    constructor() {}

    public use(error: ApiError, req, res, next) {
        const { status, code, message, internal } = error;

        const response: IApiErrorResponse = {
            message: internal ? 'Error occurred' : message,
            code: internal ? status : code,
            status
        };

        if (process.env.NODE_ENV === 'development') {
            response.stack = error.stack;
            response.code = code;
            response.message = message;
        }

        res.status(status || 500).json(response);
    }
}
