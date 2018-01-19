import { Response as ExpressResponse } from 'express';
import {
    SendResponseMiddleware, IMiddlewareError, OverrideMiddleware, ResponseData, Response
} from 'ts-express-decorators';

@OverrideMiddleware(SendResponseMiddleware)
export class ServerResponseMiddleware implements IMiddlewareError {
    public use(
        @ResponseData() data: any,
        @Response() res: ExpressResponse
    ) {
        /**
         * We want to wrap all of our api responses inside a data object
         * This will help when the API will need to response
         */
        res.json({
            data
        });
    }
}
