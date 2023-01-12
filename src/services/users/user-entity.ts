import { compare, hash } from 'bcryptjs';
import { IUserEntity } from './types';

export interface IBody {
    email: string;
    first_name: string;
    last_name: string;
}

export class UserEntity implements IUserEntity {
    public email: string;
    public first_name: string;
    public last_name: string;
    public password: string;

    constructor({ email, first_name, last_name }: IBody) {
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
    }

    async setPassword(password: string, salt: number): Promise<void> {
        this.password = await hash(password, salt);
    }

    static async comparePassword(password: string, passwordHash: string): Promise<boolean> {
        return await compare(password, passwordHash);
    }
}
