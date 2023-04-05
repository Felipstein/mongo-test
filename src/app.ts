import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import { route } from './routes';
import { APIError } from './errors/APIError';

const app = express();

app.use(express.json());
app.use(route);

app.use((err: APIError | Error | any, req: Request, res: Response, next: NextFunction) => {

  if(err instanceof APIError) {
    console.log(`${err.statusCode}: ${err.message}`);

    return res.status(err.statusCode).json({ feedback: err.message });
  }

  console.error('########################');
  console.error(err);
  console.error('########################');

  return res.status(500).json({ feedback: 'Houve um problema interno dentro do nosso servidor, tente novamente mais tarde.', errorInfo: err.message });

});

export { app };