import 'reflect-metadata';
import { App } from './app';
import InversifyContainer from './inversify.config';
import TYPES from './inversify.types';

const app = InversifyContainer.get<App>(TYPES.IApp);
app.init();
