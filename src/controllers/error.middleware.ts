import { Injectable } from '@decorators/di';
import { ErrorMiddleware } from '@decorators/express';
import { APIErrorCode } from '../types/app.types';
import { ApiError, HttpException } from '../utils/error';

export interface IApiErrorResponse {
    code: APIErrorCode;
    status: number;
    message: string;
    stack?: string;
}
@Injectable()
export class ServerErrorMiddleware implements ErrorMiddleware {
    constructor() {}

    public use(error: ApiError | HttpException, req, res, next) {
        const { status, code, message, isPublic } = error;

        const response: IApiErrorResponse = {
            message: isPublic ? message : 'Error occurred',
            code: isPublic ? code : status,
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
