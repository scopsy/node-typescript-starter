import { AppErrorCode } from '../../types/app.types';
import { isString } from 'lodash';

interface ErrorPayload {
    status?: number;
    code?: AppErrorCode;
    message: string;
}

export class HttpException extends Error {
    code: number;
    status: number;
    constructor(payload: string | ErrorPayload) {
        super(isString(payload) ? payload : payload.message);

        this.status = isString(payload) ? 500 : (payload.code || 500);
        this.code = isString(payload) ? AppErrorCode.GENERAL_ERROR : (payload.code || AppErrorCode.GENERAL_ERROR);
    }
}