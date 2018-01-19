import { Response as ExpressResponse } from 'express';
import {
    SendResponseMiddleware, IMiddlewareError, OverrideMiddleware, ResponseData, Response
} from 'ts-express-decorators';

@OverrideMiddleware(SendResponseMiddleware)
export class ServerResponseMiddleware implements IMiddlewareError {
    constructor() {}

    public use(
        @ResponseData() data: any,
        @Response() res: ExpressResponse
    ) {
        res.json({
            data
        });
    }
}
