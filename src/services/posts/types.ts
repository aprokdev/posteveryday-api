import { Request } from 'express';

export interface IPostData {
    title: string;
    html: string;
    html_preview: string;
    image: string;
    author_id: number;
    author_firstname: string;
    author_lastname: string;
}

export interface IPosts {
    create: (req: Request) => Promise<void>;
}

export interface IParseUploadResponse {
    title?: string;
    html?: string;
    imageURL?: string;
    id?: string;
}
