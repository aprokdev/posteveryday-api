import { IRequestWithUser } from '@middlewares/auth-middleware/types';
import { Post } from '@prisma/client';
import { NextFunction, Response } from 'express';

export interface IPostData {
    title: string;
    html: string;
    html_preview: string;
    image: string;
    author_id: number;
    author_firstname: string;
    author_lastname: string;
}

export interface IDeletePostParams {
    id: string;
    image: string;
}

export interface IPosts {
    create: (req: IRequestWithUser) => Promise<Post>;
    delete: (params: IDeletePostParams) => Promise<boolean>;
}

export interface IParseUploadResponse {
    title: string;
    html: string;
    imageURL: string;
    id?: string;
}
