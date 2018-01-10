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
    async rehydrateUser(id: string): Promise<User> {
        const user = await UserRepository.findById(id, '_id firstName lastName fullName picture');
        if (!user) return;

        return user;
    }

    /**
     * Generate jwt token using provider id.
     * If no user was found with the current providerId and email, it will be created.
     *
     * Valid jwt token is returned on every successfull auth
     * @param { IAuthProviders } provider
     * @param { string } accessToken
     * @param { IAuthProviderProfileDto } profile
     * @returns { Promise<IAuthDto> }
     */
    async authenticateProvider(provider: IAuthProviders, accessToken: string, profile: IAuthProviderProfileDto): Promise<IAuthDto> {
        const existingUser = await UserRepository.findOne({
            [provider]: profile.id
        });

        if (existingUser) return await this.generateToken(existingUser);

        const savedUser = await this.createUser(profile, {
            accessToken,
            provider
        });

        return await this.generateToken(savedUser);
    }

    private async generateToken(user: User): Promise<IAuthDto> {
        const payload = {
            _id: user._id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            profilePicture: user.picture
        };

        return {
            token: jwt.sign(payload, process.env.SECRET, { expiresIn: TOKEN_EXP }),
            expiresIn: moment().add(TOKEN_EXP, 'ms').format('X')
        };
    }

    private async createUser(profile: IAuthProviderProfileDto, token: IAuthToken): Promise<User> {
        const { email, firstName, lastName, id, picture } = profile;
        const user = new UserRepository({
            email,
            picture,
            lastName,
            firstName,
            facebook: id,
            tokens: [token]
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
}