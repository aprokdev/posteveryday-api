// import { AuthMiddleware } from '@middlewares/auth-middleware';
import { IDatabase } from '@services/database/types';
import { IENVConfig } from '@services/env-config/types';
import { IErrorFilter } from '@services/error-filter/types';
import { ILogger } from '@services/logger/types';
import { IUsersController } from '@services/users-controller/types';
import express from 'express';
import { inject, injectable } from 'inversify';
import TYPES from './inversify.types';
import { IApp } from './types';

@injectable()
export class App implements IApp {
    private _app;
    private _port;
    constructor(
        @inject(TYPES.ILogger) private _logger: ILogger,
        @inject(TYPES.IErrorFilter) private _errorFilter: IErrorFilter,
        @inject(TYPES.IUserController) private _userController: IUsersController,
        @inject(TYPES.IDatabase) private _db: IDatabase,
        @inject(TYPES.IENVConfig) private _env: IENVConfig,
    ) {
        this._app = express();
        this._port = 8000;
    }

    private _applyMiddlewares(): void {
        this._app.use(express.json());
        // const authMiddleware = new AuthMiddleware(this.env.get('TOKEN_SECRET'));
        // this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    private _applyControllers(): void {
        this._app.use('/users', this._userController.router);
    }

    private _useExeptionFilters(): void {
        this._app.use(this._errorFilter.execute.bind(this._errorFilter));
    }

    public init(): void {
        this._applyMiddlewares();
        this._applyControllers();
        this._useExeptionFilters();
        this._db.connect();
        this._app.listen(this._port, () => {
            this._logger.info(`Server has been started on https://localhost:${this._port}`);
        });
    }
}
