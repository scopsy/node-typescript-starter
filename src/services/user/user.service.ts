import { Inject, Service } from 'ts-express-decorators';
import { UserRepository } from '../../dal/User';

@Service()
export class UserService {
    constructor(
        @Inject(UserRepository) private userRepository: UserRepository
    ) {

    }

    async getUserById(id: string) {
        return await this.userRepository.findById(id, 'firstName lastName email fullName picture');
    }
}