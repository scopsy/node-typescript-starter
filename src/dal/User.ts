import { Injectable } from '@decorators/di';
import { model, Model, Virtual, SchemaField } from '@decorators/mongoose';
import * as mongoose from 'mongoose';

export interface IAuthToken {
    accessToken: string;
    provider: string;
}

const AuthTokenSchema = {
    provider: String,
    accessToken: String
};

@Model('User', {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})
@Injectable()
export class User {
    @SchemaField(String)
    email: string;

    @SchemaField(String)
    facebook: string;

    @SchemaField(String)
    firstName: string;

    @SchemaField(String)
    lastName: string;

    @SchemaField(String)
    picture: string;

    @SchemaField([AuthTokenSchema])
    tokens: IAuthToken[];

    @Virtual()
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

export interface User extends mongoose.Document {

}

export const UserRepository = model<mongoose.Model<User>>(User);