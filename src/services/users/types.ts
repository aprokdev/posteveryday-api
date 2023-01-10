import { User } from '@prisma/client';
import { UserRegisterDTO } from './dto';

export interface IUsers {
    create: (user: UserRegisterDTO) => Promise<User>;
}
