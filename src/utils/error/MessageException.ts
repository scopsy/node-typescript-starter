import { isString } from 'lodash';
import { AppErrorCode, ErrorPayload } from '../../types/app.types';

export class MessageException extends Error {
    code: number;
    status: number;
    constructor(payload: string | ErrorPayload) {
        super(isString(payload) ? payload : payload.message);

        this.status = isString(payload) ? 500 : (payload.code || 500);
        this.code = isString(payload) ? AppErrorCode.GENERAL_ERROR : (payload.code || AppErrorCode.GENERAL_ERROR);
    }
}