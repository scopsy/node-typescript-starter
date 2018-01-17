import { Controller, Post, PathParams, Authenticated } from 'ts-express-decorators';

@Controller('/users')
@Authenticated()
export class UserController {

    @Post('/:id')
    async getUser(@PathParams('id') id: number) {
        return 123;
    }
}