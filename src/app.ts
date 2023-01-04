import express from 'express';

// const fs = require('fs');
// const querystring = require('node:querystring');

export interface IApp {}

export class App {
  private app;
  private port;
  constructor(port: number = 8000) {
    this.app = express();
    this.port = port;
  }

  init() {
    this.app.listen(this.port, () => console.log(`Server started on port: ${this.port}`));
    // this.app.use(express.urlencoded({ extended: true }));
    // this.app.get('/', (req, res, next) => {
    //   const qs = req.originalUrl.slice(2);
    //   console.log('qs', qs);
    //   const queries = querystring.parse(qs);
    //   console.log('queries', queries);
    //   console.log('queries.value', queries.value);

    //   fs.readFile('./src/index.html', 'utf-8', (err: any, data: any) => {
    //     res.send(data);
    //   });
    // });
    // this.app.post('/', (req, res, next) => {
    //   console.log('POSTED!', req.body);
    //   res.send(req.body?.value);
    // });
  }
}
