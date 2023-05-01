import { IUser } from '@services/users/types';
import { Request } from 'express';

export interface IUserAuthInfoRequest extends Request {
    user?: null | IUser;
}
