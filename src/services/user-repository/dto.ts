import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class UserRegisterDTO {
    @IsEmail({}, { message: 'Wrong email' })
    email: string;

    @Length(6, 20, { message: 'Should have length from 6 to 20 cheracters' })
    password: string;

    @MinLength(2, { message: 'Firstname is too short' })
    @IsString({ message: 'Should be string not number' })
    first_name: string;

    @MinLength(2, { message: 'Lastname is too short' })
    @IsString({ message: 'Should be string not number' })
    last_name: string;
}

export class UserLoginDTO {
    @IsEmail({}, { message: 'Wrong email' })
    email: string;

    @Length(6, 20, { message: 'Should have length from 6 to 20 cheracters' })
    password: string;
}
