import { IUser } from '@services/users/types';
import { Request } from 'express';

export interface IRequestWithUser extends Request {
    user?: null | IUser;
}
