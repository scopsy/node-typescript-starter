import { Inject, Service } from '@tsed/common';
import { UserRepositoryToken } from '../../dal/token-constants';
import { UserRepository } from '../../dal/User';

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