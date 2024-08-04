import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router } from './routes/index';
import { handleError } from './helpers/error';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/', router);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`);
});
