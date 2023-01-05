import { Container } from 'inversify';
import { Logger } from 'tslog';
import { App } from './app';
import TYPES from './inversify.types';
import { LoggerService } from './services/logger';
import { ILogger } from './services/logger/types';
import { IApp } from './types';

const InversifyContainer = new Container({ defaultScope: 'Singleton' });

InversifyContainer.bind<IApp>(TYPES.IApp).to(App);
InversifyContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);

export default InversifyContainer;
