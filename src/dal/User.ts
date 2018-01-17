import { prop, Typegoose, InstanceType, arrayProp, instanceMethod, pre } from 'typegoose';
import * as bcrypt from 'bcrypt-nodejs';
import { IAuthProviders } from '../services/auth/auth.service';

export class AuthToken {
    @prop() accessToken: string;
    @prop() provider: IAuthProviders;
}

@pre<User>('save', function(next) {
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
})
export class User extends Typegoose {
    @prop({ unique: true }) email: string;
    @prop() password: string;
    @prop() firstName: string;
    @prop() lastName: string;
    @prop() picture?: string;

    // Providers data
    @prop() facebook?: string;
    @arrayProp({ items: AuthToken }) tokens?: AuthToken[];

    @prop()
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

export type UserInstance = InstanceType<User>;
export const UserRepository = new User().getModelForClass(User);