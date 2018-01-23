jest.mock('jsonwebtoken');

import * as jwt from 'jsonwebtoken';
import { UserRepositoryToken } from '../../dal/token-constants';
import { API_ERRORS } from '../../types/app.errors';
import { getInjectionService } from '../../utils/tests/injectors';
import { AuthService } from './auth.service';

describe('PassportAuth', () => {
    let service: AuthService;
    const userRepositoryMock = class UserRepoMock {
        static findById = jest.fn();
        save = jest.fn();
    };

    beforeEach(async () => {
        userRepositoryMock.findById.mockReset();
        const injectionService = await getInjectionService(this);
        const locals = new Map();
        locals.set(UserRepositoryToken, userRepositoryMock);
        service = injectionService.invoke<AuthService>(AuthService, locals);
    });

    it('should rehydrate user from db based on user id', async () => {
        userRepositoryMock.findById.mockReturnValue(Promise.resolve({ name: 'test' }));
        const user = await service.rehydrateUser('123');
        expect(user).toEqual({ name: 'test' });
        expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);
    });

    describe('User creation', () => {
        it('should fail validating incorrect email', async () => {
            try {
                await service.createUser({
                    email: 'asdas',
                    firstName: 'test',
                    lastName: 'test'
                });
            } catch (e) {
                expect(e.message).toEqual('Invalid email address');
            }
        });

        it('should validate weak passwords', async () => {
            try {
                await service.createUser({
                    email: 'asdas@asdas.com',
                    firstName: 'test',
                    lastName: 'test',
                    password: '123'
                });

            } catch (e) {
                expect(e.message).toEqual('Password must be 6 char long');
            }
        });

        it('should save valid user to db', async () => {
            const userData = {
                email: 'asdas@asdas.com',
                firstName: 'test',
                lastName: 'test',
                password: '12356123'
            };
            const injectionService = await getInjectionService(this);
            const locals = new Map();
            const saveMethodSpy = jest.fn().mockReturnValue(Promise.resolve(userData));

            locals.set(UserRepositoryToken, class UserRepoMock {
                save = saveMethodSpy;
            });

            service = injectionService.invoke<AuthService>(AuthService, locals);
            const savedUser = await service.createUser(userData);

            expect(savedUser).toEqual(userData);
            expect(saveMethodSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Local Authentication', () => {
        it('should fail authenticating for wrong email', async () => {
            const injectionService = await getInjectionService(this);
            const locals = new Map();
            const findSpy = jest.fn().mockReturnValue(Promise.resolve(null));
            locals.set(UserRepositoryToken, {
                findOne: findSpy
            });

            service = injectionService.invoke<AuthService>(AuthService, locals);

            try {
                await service.authenticateLocal('sda@sdsd.com', '123123123');
            } catch (e) {
                expect(e.message).toEqual(API_ERRORS.USER_NOT_FOUND.message);
            }
        });

        it('should fail validating user password', async () => {
            const injectionService = await getInjectionService(this);
            const locals = new Map();
            const matchPasswordSpy = jest.fn().mockReturnValue(false);
            class UserModel {
                matchPassword = matchPasswordSpy;
            }
            const findSpy = jest.fn().mockReturnValue(Promise.resolve(new UserModel()));
            locals.set(UserRepositoryToken, {
                findOne: findSpy
            });

            service = injectionService.invoke<AuthService>(AuthService, locals);

            try {
                await service.authenticateLocal('sda@sdsd.com', '123123123');
            } catch (e) {
                expect(e.message).toEqual(API_ERRORS.USER_WRONG_CREDENTIALS.message);
            }
        });

        it('should successfully login and generate auth token', async () => {
            const injectionService = await getInjectionService(this);
            const locals = new Map();
            const matchPasswordSpy = jest.fn().mockReturnValue(true);
            class UserModel {
                matchPassword = matchPasswordSpy;
            }
            const findSpy = jest.fn().mockReturnValue(Promise.resolve(new UserModel()));
            locals.set(UserRepositoryToken, {
                findOne: findSpy
            });

            service = injectionService.invoke<AuthService>(AuthService, locals);
            const authData = await service.authenticateLocal('sda@sdsd.com', '123123123');
            expect(authData).toHaveProperty('expires');
            expect(authData).toHaveProperty('token');
        });
    });

    describe('JWT Validations', () => {
        beforeEach(() => {
            (jwt.verify as jest.Mock).mockReset();
        });

        it('should throw unauthorized exception for invalid token', async function () {
            jwt.verify.mockImplementation(() => {
                const error = new Error('Unauthorized');
                error.name = 'Unauthorized';

                throw error;
            });

            service.rehydrateUser = jest.fn();
            try {
                await service.validateToken('123');
            } catch (e) {
                expect(jwt.verify).toHaveBeenCalledTimes(1);
                expect(e.message).toBe(API_ERRORS.UNAUTHORIZED.message);
            }
        });

        it('should rehydrate valid jwt token', async function () {
            jwt.verify.mockReturnValue({ _id: 123 });
            service.rehydrateUser = jest.fn();
            await service.validateToken('123');

            expect(service.rehydrateUser).toBeCalledWith(123);
            expect(service.rehydrateUser).toHaveBeenCalledTimes(1);
        });

        it('should throw for expired token', async function () {
            jwt.verify.mockImplementation(() => {
                const error = new Error('TokenExpiredError');
                error.name = 'TokenExpiredError';

                throw error;
            });

            try {
                await service.validateToken('123');
            } catch (e) {
                expect(jwt.verify).toHaveBeenCalledTimes(1);
                expect(e.message).toBe(API_ERRORS.EXPIRED_TOKEN.message);
            }
        });
    });
});
