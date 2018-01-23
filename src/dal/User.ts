import { InjectorService, JsonProperty } from 'ts-express-decorators';
import { prop, Typegoose, InstanceType, arrayProp, instanceMethod, pre, ModelType } from 'typegoose';
import * as bcrypt from 'bcrypt-nodejs';
import { UserRepositoryToken } from './token-constants';

export enum AuthProviderEnum {
    FACEBOOK = 'facebook'
}

export class AuthToken {
    @prop() accessToken: string;
    @prop({ enum: AuthProviderEnum }) provider: AuthProviderEnum;
}

@pre<User>('save', preSaveHook)
export class User extends Typegoose {
    @prop({ unique: true })
    @JsonProperty()
    email: string;

    @prop()
    @JsonProperty()
    firstName: string;

    @prop()
    @JsonProperty()
    lastName: string;

    @prop()
    @JsonProperty()
    password?: string;

    @prop()
    @JsonProperty()
    picture?: string;

    // Providers data
    @prop() facebook?: string;
    @arrayProp({ items: AuthToken }) tokens?: AuthToken[];

    @prop()
    @JsonProperty({
        use: String
    })
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    @instanceMethod
    matchPassword(candidatePassword: string) {
        return new Promise((resolve) => {
            bcrypt.compare(String(candidatePassword), this.password, (err, isMatch) => {
                if (err || !isMatch) return resolve(false);

                resolve(true);
            });
        });
    }
}

async function preSaveHook(next) {
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

export type UserInstance = InstanceType<User>;
export type UserRepository = ModelType<User>;
InjectorService.factory(UserRepositoryToken, new User().getModelForClass(User));
