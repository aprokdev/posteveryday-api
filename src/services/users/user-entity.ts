import { compare, hash } from 'bcryptjs';
import { inject } from 'inversify';
import TYPES from '../../inversify.types';
import { IENVConfig } from '../env-config/types';

export interface IBody {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

export class User {
    private readonly email: string;
    private readonly first_name: string;
    private readonly last_name: string;
    private password: string;
    private passwordHash: string;

    constructor(
        { email, first_name, last_name, password }: IBody,
        @inject(TYPES.IENVConfig) private envConfig: IENVConfig,
    ) {
        if (!email) {
            throw Error('email has not been provided');
            return this;
        }
        if (!first_name) {
            throw Error('first_name has not been provided');
            return this;
        }
        if (!last_name) {
            throw Error('last_name has not been provided');
            return this;
        }
        if (!password) {
            throw Error('password has not been provided');
            return this;
        }
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        // this.passwordHash = this.setHash(password);
    }

    async setHash(password: string): Promise<string> {
        const salt = this.envConfig.get('SALT');
        if (salt) {
            return hash(password, salt);
        }
        return '';
    }

    async validatePassword(): Promise<string> {
        return '';
    }
}
