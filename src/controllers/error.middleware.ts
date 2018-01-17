import { Injectable } from '@decorators/di';
import { ErrorMiddleware } from '@decorators/express';
import { ValidatorError } from 'typescript-param-validator';
import { API_ERRORS } from '../types/app.errors';
import { ApiError } from '../utils/error';

export interface IApiErrorResponse {
    code: number;
    status: number;
    message: string;
    stack?: string;
    reasons?: string[];
}

@Injectable()
export class ServerErrorMiddleware implements ErrorMiddleware {
    constructor() {}

    public use(error: ApiError | ValidatorError, req, res, next) {
        const { status, code, message } = error as ApiError;

        const response: IApiErrorResponse = {
            message: message || 'Error occurred',
            code: code,
            status
        };

        if (process.env.NODE_ENV === 'development') {
            response.stack = error.stack;
            response.code = code;
            response.message = message;
        }

        if (error instanceof ValidatorError) {
            response.code = API_ERRORS.VALIDATION_ERROR.code;
            response.message = API_ERRORS.VALIDATION_ERROR.message;
            const messages = error.validationErrors.map((i) => {
                const items = [];

                for (const key of Object.keys(i.constraints)) {
                    items.push(i.constraints[key]);
                }
                return items;
            });

            response.reasons = [].concat(...messages);
        }

        res.status(status || 500).json(response);
    }
}
