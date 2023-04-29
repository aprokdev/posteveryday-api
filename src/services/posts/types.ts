import { Request } from 'express';

export interface IPosts {
    create: (data: IUserData) => Promise<IUserData>;
    parseFieldsAndS3Upload: (req: Request) => Promise<IParseUploadResponse>;
}

export interface IUserData {
    title: string;
    html: string;
    html_preview: string;
    image: string;
    author_id: number;
    author_firstname: string;
    author_lastname: string;
}

export interface IParseUploadResponse {
    title?: string;
    html?: string;
    imageURL?: string;
    id?: string;
}
