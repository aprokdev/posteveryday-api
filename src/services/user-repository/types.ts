import { User } from '@prisma/client';
import { UserRegisterDTO } from './dto';

export interface IUserRepository {
    create: (user: UserRegisterDTO) => Promise<User>;
}
