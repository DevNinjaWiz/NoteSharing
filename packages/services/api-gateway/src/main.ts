import express from 'express';
import { setUpApi } from './api/api';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

setUpApi(app);

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});