import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { Injectable } from '@decorators/di';
import { IAuthToken, User, UserRepository } from '../../dal/User';
import { API_ERRORS } from '../../types/app.errors';
import { MongoErrorCode } from '../../types/mongo';
import { ApiError } from '../../utils/error';
import { UnexpectedError } from '../../utils/error/UnexpectedError';
import { IAuthDto, IAuthProviderProfileDto } from './auth.dto';

const DAY = 60000 * 60 * 24;
export const TOKEN_EXP = DAY * 7;

export type IAuthProviders = 'facebook';

@Injectable()
export class AuthService {
    private USER_TOKEN_FIELDS = '_id email lastName firstName picture fullName';

    /**
     * Used to fetch user based on its id.
     *
     * There are multiple approaches with working with jwt,
     * You can skip the hydration process and use only the jwt token as the user data.
     * But if you need to invalidate user token dynamically a db/redis query should be made.
     *
     * @param {string} id
     * @returns {Promise<User>}
     */
    async rehydrateUser(id: string): Promise<User> {
        const user = await UserRepository.findById(id, this.USER_TOKEN_FIELDS);
        if (!user) return;

        return user;
    }

    async createUser(profile: IAuthProviderProfileDto): Promise<User> {
        const user = new UserRepository({
            ...profile
        });

        try {
            return await user.save();
        } catch (e) {
            if (e.code === MongoErrorCode.DUPLICATE_KEY) {
                throw new ApiError(API_ERRORS.USER_ALREADY_EXISTS);
            }

            throw new UnexpectedError();
        }
    }

    async authenticateLocal(email: string, password: string): Promise<IAuthDto>  {
        const user = await UserRepository.findOne({ email }, this.USER_TOKEN_FIELDS);
        if (!user) throw new ApiError(API_ERRORS.USER_NOT_FOUND);

        const isMatch = await user.matchPassword(password);
        if (!isMatch) throw new ApiError(API_ERRORS.USER_WRONG_CREDENTIALS);

        return await this.generateToken(user);
    }

    /**
     * Generate jwt token using provider id.
     * If no user was found with the current providerId and email, it will be created.
     *
     * Valid jwt token is returned on every successfull auth
     * @param { IAuthProviders } provider
     * @param { string } providerId
     * @param { IAuthProviderProfileDto } profile
     * @returns { Promise<IAuthDto> }
     */
    async authenticateProvider(provider: IAuthProviders, providerId: string, profile: IAuthProviderProfileDto): Promise<IAuthDto> {
        const existingUser = await UserRepository.findOne({
            [provider]: providerId
        });
        if (existingUser) return await this.generateToken(existingUser);

        const savedUser = await this.createUser(profile);

        return await this.generateToken(savedUser);
    }

    private async generateToken(user: User): Promise<IAuthDto> {
        const payload = {
            _id: user._id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            picture: user.picture
        } as User;

        return {
            token: jwt.sign(payload, process.env.SECRET, { expiresIn: TOKEN_EXP }),
            expires: moment().add(TOKEN_EXP, 'ms').format('X')
        };
    }
}