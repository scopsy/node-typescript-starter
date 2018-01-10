import { isString } from 'lodash';
import { APIErrors } from '../../types/app.errors';
import { ErrorPayload } from '../../types/app.types';

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
            this.code = APIErrors.GENERAL_ERROR.code;
        } else {
            this.code = (payload.code || APIErrors.GENERAL_ERROR.code);
            this.status = (payload.status || 500);
        }
    }
}