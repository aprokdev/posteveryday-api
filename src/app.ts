import express from 'express';
import { inject, injectable } from 'inversify';
import TYPES from './inversify.types';
import { IDatabase } from './services/database/types';
import { IENVConfig } from './services/env-config/types';
import { IErrorFilter } from './services/error-filter/types';
import { ILogger } from './services/logger/types';
import { IUsersController } from './services/users-controller/types';
import { IApp } from './types';

@injectable()
export class App implements IApp {
    private app;
    private port;
    constructor(
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IErrorFilter) public errorFilter: IErrorFilter,
        @inject(TYPES.IUserController) public userController: IUsersController,
        @inject(TYPES.IDatabase) public database: IDatabase,
        @inject(TYPES.IENVConfig) public envConfig: IENVConfig,
    ) {
        this.app = express();
        this.port = 8000;
    }

    applyMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(this.errorFilter.execute.bind(this.errorFilter));
    }

    applyControllers(): void {
        this.app.use('/users', this.userController.router);
    }

    init(): void {
        this.applyMiddlewares();
        this.applyControllers();
        this.database.connect();
        this.app.listen(this.port, () => {
            this.logger.info(`Server has been started on https://localhost:${this.port}`);
        });
    }
}
