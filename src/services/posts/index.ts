import { Upload } from '@aws-sdk/lib-storage';
import { HTTPError401 } from '@errors/index';
import { IUserAuthInfoRequest } from '@middlewares/auth-middleware/types';
import { Post } from '@prisma/client';
import { IDatabase } from '@services/database/types';
import { IENVConfig } from '@services/env-config/types';
import { ILogger } from '@services/logger/types';
import { IS3Client } from '@services/s3-client/types';
import TYPES from '@src/inversify.types';
import busboy from 'busboy';
import { NextFunction, Request } from 'express';
import { inject, injectable } from 'inversify';
import { IParseUploadResponse, IPostData, IPosts } from './types';

@injectable()
export class Posts implements IPosts {
    constructor(
        @inject(TYPES.IDatabase) private _db: IDatabase,
        @inject(TYPES.IS3Client) private _s3: IS3Client,
        @inject(TYPES.IENVConfig) private _env: IENVConfig,
    ) {}

    async create(req: IUserAuthInfoRequest): Promise<Post> {
        const { user } = req;
        console.log(user);
        if (user) {
            const { id, first_name, last_name } = user;

            const { title, html, imageURL } = await this._parseFieldsAndS3Upload(req);
            console.log('DATA', { title, html, imageURL });

            return await this._db.instance.post.create({
                data: {
                    title,
                    html,
                    html_preview: html.slice(0, 340),
                    image: imageURL,
                    author_id: Number(id),
                    author_firstname: first_name,
                    author_lastname: last_name,
                },
            });
        } else {
            throw new HTTPError401('You must be authorized to perform that action');
        }
    }

    private _parseFieldsAndS3Upload(req: Request): Promise<IParseUploadResponse> {
        return new Promise((res, rej) => {
            const bb = busboy({ headers: req.headers });

            let isFile = false;

            const fields: any = {
                title: '',
                html: '',
            };

            bb.on('file', async (name, file, info) => {
                isFile = true;

                const { filename, mimeType } = info;

                try {
                    const params = {
                        Bucket: this._env.get('AWS_S3_BUCKET_NAME'),
                        Key: `images/${new Date().toISOString().replace(/\.||-/g, '')}-${filename}`,
                        Body: file,
                    };

                    const upload = new Upload({ client: this._s3.instance, params });
                    const { Location }: any = await upload.done();
                    console.log('Location', Location);

                    console.log('111', { imageURL: Location, ...fields });

                    res({ imageURL: Location, ...fields });
                } catch (error) {
                    rej(error);
                }
            });

            bb.on('field', (name, val, info) => {
                fields[`${name}`] = val;
            });

            bb.on('finish', () => {
                if (!isFile) {
                    console.log('here');

                    res(fields);
                }
                if (isFile) {
                    res({ imageURL: '', ...fields });
                }
            });

            req.pipe(bb);
        });
    }
}
