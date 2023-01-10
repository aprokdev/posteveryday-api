import { Container } from 'inversify';
import { App } from './app';
import TYPES from './inversify.types';
import { Database } from './services/database';
import { IDatabase } from './services/database/types';
import { ErrorFilter } from './services/error-filter';
import { IErrorFilter } from './services/error-filter/types';
import { LoggerService } from './services/logger';
import { ILogger } from './services/logger/types';
import { UserController } from './services/user-controller';
import { IUserController } from './services/user-controller/types';
import { UserRepository } from './services/user-repository';
import { IUserRepository } from './services/user-repository/types';
import { IApp } from './types';

const InversifyContainer = new Container({ defaultScope: 'Singleton' });

InversifyContainer.bind<IApp>(TYPES.IApp).to(App);
InversifyContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
InversifyContainer.bind<IErrorFilter>(TYPES.IErrorFilter).to(ErrorFilter);
InversifyContainer.bind<IUserController>(TYPES.IUserController).to(UserController);
InversifyContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
InversifyContainer.bind<IDatabase>(TYPES.IDatabase).to(Database);

export default InversifyContainer;
