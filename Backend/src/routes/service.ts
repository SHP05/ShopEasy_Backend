import { Router } from 'express';
import {
  createService,
  deleteService,
  updateService,
} from '../controllers/service';
import authmiddleware from '../middlewares/auth';

export const router = Router();

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
