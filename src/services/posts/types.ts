import { IRequestWithUser } from '@middlewares/auth-middleware/types';
import { Post } from '@prisma/client';

export interface IPostData {
    title: string;
    html?: string;
    html_preview: string;
    image: string;
    author_id: number;
    author_firstname: string;
    author_lastname: string;
    created: string;
}

export interface IDeletePostParams {
    id: string;
    image: string;
}

type queryParam = string;

export interface IGetPostsParams {
    offset: queryParam;
    limit: queryParam;
    author_id?: queryParam;
    order?: queryParam;
    order_field?: queryParam;
}

export interface IPosts {
    create: (req: IRequestWithUser) => Promise<IPostData>;
    update: (req: IRequestWithUser) => Promise<IPostData>;
    getMany: (params: IGetPostsParams) => Promise<IPostData[]>;
    delete: (params: IDeletePostParams) => Promise<boolean>;
}

export interface IParseUploadResponse {
    title: string;
    html: string;
    imageURL: string;
    id?: string;
}
