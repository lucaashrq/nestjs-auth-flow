import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { User } from '../user/user.entity'
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET_KEY'),
                    signOptions: {
                        expiresIn: Number(configService.get('JWT_EXPIRATION_TIME'))
                    },
                };
            }
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy
    ],
    exports: [PassportModule.register({ defaultStrategy: 'jwt' })]
})

export class AuthModule {}
