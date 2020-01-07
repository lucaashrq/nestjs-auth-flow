import { ApiProperty } from '@nestjs/swagger'

export class AuthenticationDTO {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}