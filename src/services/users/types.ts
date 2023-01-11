import { User } from '@prisma/client';
import { UserRegisterDTO } from './dto';

export interface IUsers {
    findByEmail: (email: string) => Promise<User | null>;
    create: (user: UserRegisterDTO) => Promise<boolean>;
}

export interface IUserEntity {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    setPassword: (password: string, salt: number) => Promise<void>;
    validatePassword: (password: string) => Promise<boolean>;
}
