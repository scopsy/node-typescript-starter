import { Injectable } from '@decorators/di';
import { model, Model, Virtual, SchemaField, Hook, Instance } from '@decorators/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

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
    @SchemaField({
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    }) email: string;
    @SchemaField(String) password: string;
    @SchemaField(String) firstName: string;
    @SchemaField(String) lastName: string;
    @SchemaField(String) picture: string;

    // Providers data
    @SchemaField(String) facebook: string;
    @SchemaField([AuthTokenSchema]) tokens: IAuthToken[];

    @Virtual()
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    @Instance()
    matchPassword(candidatePassword: string) {
        return new Promise((resolve) => {
            bcrypt.compare(String(candidatePassword), this.password, (err, isMatch) => {
                if (err || !isMatch) return resolve(false);

                resolve(true);
            });
        });
    }

    @Hook('pre', 'save')
    preSaveHook(next) {
        const user = this;
        if (!user.isModified('password')) return next();

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(String(user.password), salt, null, (err, hash) => {
                if (err) return next(err);

                user.password = hash;
                next();
            });
        });
    }
}

export interface User extends mongoose.Document {

}

export const UserRepository = model<mongoose.Model<User>>(User);