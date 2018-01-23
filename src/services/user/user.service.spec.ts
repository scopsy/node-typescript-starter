import { UserRepositoryToken } from '../../dal/token-constants';
import { getInjectionService } from '../../utils/tests/injectors';
import { UserService } from './user.service';

describe('UserService', () => {
    it('should fetch user by id', async () => {
        const inject = await getInjectionService(this);
        const locals = new Map();
        const userData = { name: 'test' };
        const findSpy = jest.fn().mockReturnValue(Promise.resolve(userData));
        locals.set(UserRepositoryToken, {
            findById: findSpy
        });

        const service = inject.invoke<UserService>(UserService, locals);
        const foundUser = await service.getUserById('123');

        expect(foundUser).toEqual(userData);
        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(findSpy.mock.calls[0][0]).toBe('123');
    });
});