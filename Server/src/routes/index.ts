import { Request, Response, Router } from 'express';
import { router as userRouter } from './user';
import { router as serviceRouter } from './service';
import { router as clientRouter } from './client';
import { router as recordRouter } from './records';
import authmiddleware from '../middlewares/auth';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Welcome to Shop Easy !!' });
});

router.use('/user', userRouter);
router.use('/service', authmiddleware, serviceRouter);
router.use('/client', authmiddleware, clientRouter);
router.use('/record', authmiddleware, recordRouter);
