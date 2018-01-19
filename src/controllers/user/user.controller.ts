import { Controller, Post, PathParams, Authenticated, Inject, Required } from 'ts-express-decorators';
import { Returns } from 'ts-express-decorators/lib/swagger';
import { Summary, Security } from 'ts-express-decorators/swagger';
import { APP_SECURITY } from '../../config/swagger';
import { User, UserInstance } from '../../dal/User';
import { UserService } from '../../services/user/user.service';

@Controller('/users')
@Authenticated()
export class UserController {
    constructor(
        private userService: UserService
    ) {

    }

    @Post('/:id')
    @Security(APP_SECURITY)
    @Returns(User)
    async getUser(@Required() @PathParams('id') id: string): Promise<User> {
        return await this.userService.getUserById(id);
    }
}