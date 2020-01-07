import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { UserDTO } from '../user/models/user.dto'
import { AuthenticationDTO } from './models/authentication.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async createToken(userDto: UserDTO) {
        return {
            expiresIn: 3600,
            accessToken: this.jwtService.sign({ id: userDto.id })
        };
    }

    async validateUser(authenticationDto: AuthenticationDTO): Promise<any> {
        const user = await this.userService.findByEmail(authenticationDto.username);

        if (!user)
            throw new UnauthorizedException('Nome de usuário e/ou senha inválidos.');

        const hashIsValid = await this.userService.compareHash(authenticationDto.password, user.password);

        if (!hashIsValid)
            throw new UnauthorizedException('Nome de usuário e/ou senha inválidos.');

        const { password, ...data } = user;

        return data;
    }
}