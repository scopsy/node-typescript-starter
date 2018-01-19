import { NextFunction as ExpressNext, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import {
    IMiddlewareError, Err, Next, Request, Response,
    OverrideMiddleware, GlobalErrorHandlerMiddleware
} from 'ts-express-decorators';
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

@OverrideMiddleware(GlobalErrorHandlerMiddleware)
export class ServerErrorMiddleware implements IMiddlewareError {
    constructor() {}

    public use(
        @Err() error: ApiError | ValidatorError,
        @Request() request: ExpressRequest,
        @Response() res: ExpressResponse,
        @Next() next: ExpressNext
    ) {
        // tslint:disable-next-line
        let { status, code, message } = error as ApiError;

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

            status = 400;
            response.status = 400;
            response.reasons = [].concat(...messages);
        }

        res.status(status || 500).json(response);
    }
}
