import 'reflect-metadata';
import 'ts-express-decorators/swagger';

import * as Path from 'path';
import * as dotenv from 'dotenv';
import * as logger from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';

dotenv.config({ path: '.env' });

import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from 'ts-express-decorators';
import { $log } from 'ts-log-debug';
import { MongooseService } from './services/shared/mongoose.service';

const rootDir = Path.resolve(__dirname);
@ServerSettings({
    rootDir,
    mount: {
        '/v1': `${rootDir}/controllers/**/**.controller.{ts,js}`
    },
    componentsScan: [
        `${rootDir}/services/**/**.service.{ts,js}`,
        `${rootDir}/middlewares/**/**.{ts,js}`,
        `${rootDir}/dal/**/**.{ts,js}`
    ],
    httpPort: process.env.PORT || 3000,
    httpsPort: false,
    acceptMimes: ['application/json'],
    swagger: {
        path: '/api-docs'
    }
})
export class Server extends ServerLoader {
    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public async $onMountingMiddlewares(): Promise<any> {
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(bodyParser())
            .use(compression())
            .use(express())
            .use(logger('dev'))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    async $onInit(): Promise<any> {
        await MongooseService.connect();
        $log.debug('DB connected');
    }

    public $onReady() {
        $log.info('Server started...');
    }

    public $onServerInitError(err) {
        $log.error(err);
    }
}

