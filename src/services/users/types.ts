import { User } from '@prisma/client';
import { IUser } from '../../utils/user-entity';
import { UserLoginDTO, UserRegisterDTO } from './dto';

export interface IUsers {
    findByEmail: (email: string) => Promise<User | null>;
    create: (user: UserRegisterDTO) => Promise<IUser>;
    validateUser: (user: UserLoginDTO) => Promise<boolean>;
    signToken: (email: string) => Promise<string>;
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
