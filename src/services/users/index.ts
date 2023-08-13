import { HTTPError422 } from '@errors/index';
import { IDatabase } from '@services/database/types';
import { validatePassword } from '@services/users/user-entity';
import { UserEntity } from '@services/users/user-entity';
import TYPES from '@src/inversify.types';
import { inject, injectable } from 'inversify';
import { UserLoginDTO, UserRegisterDTO } from './dto';
import { IUser, IUsers } from './types';

@injectable()
export class Users implements IUsers {
    constructor(@inject(TYPES.IDatabase) private _db: IDatabase) {}
    signToken: (email: string) => Promise<string>;

    public async findByEmail(email: string): Promise<IUser | null> {
        return await this._db.instance.user.findUnique({
            where: { email },
        });
    }

    public async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
        if (!email || !password) {
            throw new HTTPError422('"email" and "password" fields are required');
        }
        const existedUser = await this.findByEmail(email);
        if (!existedUser) {
            throw new HTTPError422('Provided credentials are invalid');
        }
        return validatePassword(password, existedUser.hash, existedUser.salt);
    }

    public async create(body: UserRegisterDTO): Promise<IUser> {
        // check if user already exist:
        const existedUser = await this.findByEmail(body.email);
        if (existedUser) {
            throw new HTTPError422('User with provided email is already exist');
        }
        const newUser = new UserEntity(body);
        return await this._db.instance.user.create({ data: newUser });
    }
}
