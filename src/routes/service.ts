import { Router } from 'express';
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from '../controllers/service';

export const router = Router();

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/:id', getServices);
