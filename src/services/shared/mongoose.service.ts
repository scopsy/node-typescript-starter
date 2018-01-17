import * as mongoose from 'mongoose';
import { Service } from 'ts-express-decorators';
import { $log } from 'ts-log-debug';

(<any>mongoose).Promise = global.Promise;

@Service()
export class MongooseService {

    static resource: mongoose.Connection;

    getResource = (): mongoose.Connection => MongooseService.resource;

    /**
     *
     * @returns {Promise<Mongoose.Connection>}
     */
    static async connect(): Promise<mongoose.Connection> {
        const mongoUrl = process.env.MONGODB_URI;

        if (MongooseService.resource) {
            return MongooseService.resource;
        }

        $log.debug('new MongooseUrl().toString()', mongoUrl);
        const db = await mongoose.connect(mongoUrl, {
            useMongoClient: true
        });

        MongooseService.resource = db;
        return db;
    }
}