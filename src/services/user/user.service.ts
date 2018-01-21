import { UserRepositoryToken } from '@api/dal/token-constants';
import { UserRepository } from '@api/dal/User';
import { Inject, Service } from 'ts-express-decorators';

@Service()
export class UserService {
    constructor(
        @Inject(UserRepositoryToken) private userRepository: UserRepository
    ) {

    }

    async getUserById(id: string) {
        return await this.userRepository.findById(id, 'firstName lastName email fullName picture');
    }
}