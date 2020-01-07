import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { AuthenticationDTO } from 'src/modules/auth/models/authentication.dto'
import { UserDTO } from '../user/models/user.dto'

@Controller('authentication')
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('/login')
    async login(@Body() authenticationDto: AuthenticationDTO) : Promise<any> {
        const user = await this.authService.validateUser(authenticationDto);
        return await this.authService.createToken(user);
    }

    @Post('/register')
    async register(@Body() userDto: UserDTO) : Promise<any> {
        return await this.userService.create(userDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('me')
    async getMe(@Request() request): Promise<any> {
        return request.user;
    }
}