import * as mongoose from 'mongoose';
import { Service } from 'ts-express-decorators';

(mongoose as any).Promise = global.Promise;

@Service()
export class MongooseService {
    static resource: mongoose.Connection;

    static async connect(): Promise<mongoose.Connection> {
        const mongoUrl = process.env.MONGODB_URI;

        if (MongooseService.resource) {
            return MongooseService.resource;
        }

        const db = await mongoose.connect(mongoUrl, {
            useMongoClient: true
        });

        MongooseService.resource = db;
        return db;
    }
}