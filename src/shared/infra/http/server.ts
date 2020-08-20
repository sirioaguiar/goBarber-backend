import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { errors } from 'celebrate';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('backend rodando');
});
