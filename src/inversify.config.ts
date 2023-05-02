import { ErrorFilter } from '@middlewares/error-filter';
import { IErrorFilter } from '@middlewares/error-filter/types';
import { Database } from '@services/database';
import { IDatabase } from '@services/database/types';
import { ENVConfig } from '@services/env-config';
import { IENVConfig } from '@services/env-config/types';
import { LoggerService } from '@services/logger';
import { ILogger } from '@services/logger/types';
import { Posts } from '@services/posts';
import { PostsController } from '@services/posts-controller';
import { IPostsController } from '@services/posts-controller/types';
import { IPosts } from '@services/posts/types';
import { S3Client } from '@services/s3-client';
import { IS3Client } from '@services/s3-client/types';
import { Users } from '@services/users';
import { UsersController } from '@services/users-controller';
import { IUsersController } from '@services/users-controller/types';
import { IUsers } from '@services/users/types';
import { Container } from 'inversify';
import { App } from './app';
import TYPES from './inversify.types';
import { IApp } from './types';

const InversifyContainer = new Container({ defaultScope: 'Singleton' });

InversifyContainer.bind<IApp>(TYPES.IApp).to(App);
InversifyContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
InversifyContainer.bind<IErrorFilter>(TYPES.IErrorFilter).to(ErrorFilter);
InversifyContainer.bind<IUsersController>(TYPES.IUserController).to(UsersController);
InversifyContainer.bind<IUsers>(TYPES.IUsers).to(Users);
InversifyContainer.bind<IDatabase>(TYPES.IDatabase).to(Database);
InversifyContainer.bind<IENVConfig>(TYPES.IENVConfig).to(ENVConfig);
InversifyContainer.bind<IPosts>(TYPES.IPosts).to(Posts);
InversifyContainer.bind<IPostsController>(TYPES.IPostsController).to(PostsController);
InversifyContainer.bind<IS3Client>(TYPES.IS3Client).to(S3Client);

export default InversifyContainer;
