import { HTTPError } from '@errors/index';
import { User } from '@prisma/client';
import { IDatabase } from '@services/database/types';
import { IENVConfig } from '@services/env-config/types';
import { ILogger } from '@services/logger/types';
import { IUser, genPassword } from '@utils/user-entity';
import { inject, injectable } from 'inversify';
import TYPES from 'inversify.types';
import { UserLoginDTO, UserRegisterDTO } from './dto';
import { IUsers } from './types';

@injectable()
export class Users implements IUsers {
    constructor(
        @inject(TYPES.IDatabase) public database: IDatabase,
        @inject(TYPES.IENVConfig) public envConfig: IENVConfig,
        @inject(TYPES.ILogger) public logger: ILogger,
    ) {}
    validateUser: (user: UserLoginDTO) => Promise<boolean>;

    async findByEmail(email: string): Promise<IUser | null> {
        return this.database.prismaClient.user.findUnique({
            where: { email },
        });
    }

    // async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
    //     const existedUser = await this.findByEmail(email);
    //     if (!existedUser) {
    //         throw new HTTPError(401, 'There is no user with provided email');
    //     }
    //     return await UserEntity.comparePassword(password, existedUser.password);
    // }

    async create(body: UserRegisterDTO): Promise<IUser> {
        const { email, first_name, last_name, password } = body;
        // check if user already exist:
        const existedUser = await this.findByEmail(email);
        if (existedUser) {
            throw new HTTPError(422, 'User with provided email is already exist');
        }

        const { salt, hash } = genPassword(password);

        return await this.database.prismaClient.user.create({
            data: {
                email,
                first_name,
                last_name,
                hash,
                salt,
                role: 'user',
                image: '',
            },
        });
    }
}
