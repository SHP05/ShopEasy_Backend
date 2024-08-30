import { Request, Response, Router } from 'express';
import {
  register,
  login,
  logOut,
  updateUser,
  forgotPassword,
} from '../controllers/users';
import authmiddleware from '../middlewares/auth';

export const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logOut);
router.put('/update/:id', authmiddleware, updateUser);
router.post('/forgotPass', authmiddleware, forgotPassword);
