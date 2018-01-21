jest.mock('jsonwebtoken');

import * as jwt from 'jsonwebtoken';
import { AuthService } from '@api/services/auth/auth.service';
import { API_ERRORS } from '@api/types/app.errors';
import { getInjectionService } from '@api/utils/tests/injectors';

describe('PassportAuth', () => {
    let service: AuthService;

    beforeEach(async () => {
        const injectionService = await getInjectionService(this);
        service = injectionService.invoke<AuthService>(AuthService);
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
