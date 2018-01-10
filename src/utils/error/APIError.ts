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
    internal: boolean;

    /**
     *
     * @param { string | ErrorPayload } payload
     * @param { boolean } internal - defines if the error should be reported to the client
     */
    constructor(payload: string | ErrorPayload, internal = false) {
        super(isString(payload) ? payload : payload.message);
        this.internal = internal;

        if (isString(payload)) {
            this.status = 500;
            this.code = API_ERRORS.GENERAL_ERROR.code;
        } else {
            this.code = (payload.code || API_ERRORS.GENERAL_ERROR.code);
            this.status = (payload.status || 500);
        }
    }
}