import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { Inject, Service } from 'ts-express-decorators';
import { UserRepositoryToken } from '../../dal/token-constants';
import { AuthProviderEnum, UserInstance, UserRepository } from '../../dal/User';
import { API_ERRORS } from '../../types/app.errors';
import { MongoErrorCode } from '../../types/mongo';
import { ApiError } from '../../utils/error';
import { UnexpectedError } from '../../utils/error/UnexpectedError';
import { validateEmail } from '../../utils/helper.service';
import { AuthDto, IAuthProviderProfileDto } from './auth.dto';
import { Request, Response, NextFunction } from 'express';
import { PassportAuthService } from './passport/passport-auth.service';
import { AUTH_STRATEGY } from './passport/passport.service';

const DAY = 60000 * 60 * 24;
export const TOKEN_EXP = DAY * 7;

@Service()
export class AuthService {
    private USER_TOKEN_FIELDS = '_id email lastName firstName picture fullName';

    constructor(
        @Inject(UserRepositoryToken) public userRepository: UserRepository,
        private passportAuthService: PassportAuthService
    ) {

    }

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
    async rehydrateUser(id: string): Promise<UserInstance> {
        const user = await this.userRepository.findById(id, this.USER_TOKEN_FIELDS);
        if (!user) return;

        return user;
    }

    async createUser(profile: IAuthProviderProfileDto): Promise<UserInstance> {
        this.validateProfile(profile);

        const user = new this.userRepository({
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

    async authenticateLocal(email: string, password: string): Promise<AuthDto>  {
        const user = await this.userRepository.findOne({ email }, this.USER_TOKEN_FIELDS + ' password');
        if (!user) throw new ApiError(API_ERRORS.USER_NOT_FOUND);
        const isMatch = await user.matchPassword(password);
        if (!isMatch) throw new ApiError(API_ERRORS.USER_WRONG_CREDENTIALS);

        return await this.generateToken(user);
    }

    async authenticateStrategy(strategy: AUTH_STRATEGY, req: Request, res: Response, next: NextFunction): Promise<AuthDto>  {
        return await this.passportAuthService.strategyAuthenticate(strategy, req, res, next);
    }

    async validateToken(token: string) {
        try {
            const payload = jwt.verify(token, process.env.SECRET);

            return await this.rehydrateUser(payload._id);
        } catch (e) {
            if (e.name === 'TokenExpiredError') throw new ApiError(API_ERRORS.EXPIRED_TOKEN);

            throw new ApiError(API_ERRORS.UNAUTHORIZED);
        }
    }

    /**
     * Generate jwt token using provider id.
     * If no user was found with the current providerId and email, it will be created.
     *
     * Valid jwt token is returned on every successful auth
     * @param { IAuthProviders } provider
     * @param { string } providerId
     * @param { IAuthProviderProfileDto } profile
     * @returns { Promise<AuthDto> }
     */
    async generateProviderToken(provider: AuthProviderEnum, providerId: string, profile: IAuthProviderProfileDto): Promise<AuthDto> {
        const existingUser = await this.userRepository.findOne({
            [provider]: providerId
        });
        if (existingUser) return await this.generateToken(existingUser);

        const savedUser = await this.createUser(profile);
        return await this.generateToken(savedUser);
    }

    private validateProfile(profile: IAuthProviderProfileDto) {
        if (!profile.email) throw new ApiError('Missing email field', 400);
        if (!validateEmail(profile.email)) throw new ApiError('Invalid email address', 400);
        if (!profile.firstName) throw new ApiError('Missing firstName field', 400);
        if (profile.password && profile.password.length < 6) throw new ApiError('Password must be 6 char long', 400);
    }

    private async generateToken(user: UserInstance): Promise<AuthDto> {
        const payload: UserInstance = {
            _id: user._id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            picture: user.picture
        } as any;

        return {
            token: jwt.sign(payload, process.env.SECRET, { expiresIn: TOKEN_EXP }),
            expires: moment().add(TOKEN_EXP, 'ms').format('X')
        };
    }
}