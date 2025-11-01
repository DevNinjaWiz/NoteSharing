import express, { Request, Response } from 'express';
import * as path from 'path';
import { MessageResponse } from '@note-sharing/shared';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req: Request, res: Response<MessageResponse>) => {
  res.send({ message: 'Welcome to notes-service!!' });
});

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
