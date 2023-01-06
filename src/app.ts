import express from 'express';
import { inject, injectable } from 'inversify';
import TYPES from './inversify.types';
import { IErrorFilter } from './services/error-filter/types';
import { ILogger } from './services/logger/types';
import { IApp } from './types';

@injectable()
export class App implements IApp {
    private app;
    private port;
    constructor(
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IErrorFilter) public errorFilter: IErrorFilter,
    ) {
        this.app = express();
        this.port = 8000;
    }

    applyMiddlewares(): void {
        this.app.use(this.errorFilter.execute.bind(this.errorFilter));
    }

    init(): void {
        this.app.listen(this.port, () => {
            this.logger.info(`Server has been started on https://localhost:${this.port}`);
        });
        this.applyMiddlewares();
    }
}
