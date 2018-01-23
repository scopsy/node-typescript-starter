import { isString } from 'lodash';
import { API_ERRORS } from '../../types/app.errors';

export interface ErrorPayload {
    status?: number;
    code?: number;
    message: string;
}

export class ApiError extends Error {
    code: number;
    status: number;

    constructor(payload: string | ErrorPayload, status = 500) {
        super(isString(payload) ? payload : payload.message);

        if (isString(payload)) {
            this.status = status;
            this.code = API_ERRORS.GENERAL_ERROR.code;
        } else {
            this.code = (payload.code || API_ERRORS.GENERAL_ERROR.code);
            this.status = (payload.status || status);
        }
    }
}