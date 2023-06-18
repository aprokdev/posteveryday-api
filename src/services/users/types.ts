import { User } from '@prisma/client';
import { UserLoginDTO, UserRegisterDTO } from './dto';

export interface IUsers {
    findByEmail: (email: string) => Promise<User | null>;
    create: (user: UserRegisterDTO) => Promise<IUser>;
    validateUser: (user: UserLoginDTO) => Promise<boolean>;
}

export interface IRegisterUserBody {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

export interface IUserEntity {
    email: string;
    first_name: string;
    last_name: string;
    salt: string;
    hash: string;
    role: 'user' | 'admin';
    image: string;
}

export type hashedPasswordData = {
    salt: string;
    hash: string;
};

export interface IUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    hash: string;
    salt: string;
    role: string;
    image: string;
}
