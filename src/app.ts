import 'reflect-metadata';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as logger from 'morgan';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';

import { Container } from '@decorators/di';
import { attachControllers, ERROR_MIDDLEWARE } from '@decorators/express';

import { API_ROOT } from './app.constants';
import { APP_CONTROLLERS } from './controllers';
import { PassportService } from './services/auth/passport/passport.service';
import { ServerErrorMiddleware } from './controllers/error.middleware';
import { ApiError } from './utils/error';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

// Create Express server
const app = express();
const apiRouter = express.Router() ;

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI;
(<any>mongoose).Promise = Promise;

mongoose.connect(mongoUrl, { useMongoClient: true })
    .then(() => {})
    .catch(err => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit();
    });

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API keys and Passport configuration
const passportService = Container.get<PassportService>(PassportService);
passportService.initialize(app);

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(API_ROOT, apiRouter);

Container.provide([
    { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware }
]);

attachControllers(apiRouter, [
    ...APP_CONTROLLERS
]);

process.on('unhandledRejection', (reason, p) => {
    // application specific logging, throwing an error, or other logic here
});

export default app;