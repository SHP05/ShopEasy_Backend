import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router } from './routes/index';
import { handleError } from './helpers/error';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const corsOption = {
  credentials: true,
  origin: ['http://localhost:5173'],
};
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());

app.use('/', router);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`);
});
