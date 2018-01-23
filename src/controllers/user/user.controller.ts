import { Controller, Get, PathParams, Authenticated, Required } from 'ts-express-decorators';
import { Returns } from 'ts-express-decorators/lib/swagger';
import { User } from '../../dal/User';
import { UserService } from '../../services/user/user.service';

@Controller('/users')
@Authenticated()
export class UserController {
    constructor(
        private userService: UserService
    ) {

    }

    @Get('/:id')
    @Returns(User)
    async getUser(@Required() @PathParams('id') id: string): Promise<User> {
        return await this.userService.getUserById(id);
    }
}