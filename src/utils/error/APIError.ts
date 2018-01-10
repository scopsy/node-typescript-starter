import { isString } from 'lodash';
import { APIErrorCode, ErrorPayload } from '../../types/app.types';

export class ApiError extends Error {
    code: number;
    status: number;
    isPublic: boolean;

    /**
     * Creates an API Error
     * Usually used by internal services
     * @param {string | ErrorPayload} payload
     * @param {boolean} isPublic - defines if the error should be reported to the client
     */
    constructor(payload: string | ErrorPayload, isPublic = false) {
        super(isString(payload) ? payload : payload.message);

        this.status = isString(payload) ? 500 : (payload.code || 500);
        this.code = isString(payload) ? APIErrorCode.GENERAL_ERROR : (payload.code || APIErrorCode.GENERAL_ERROR);
        this.isPublic = isPublic;
    }
}