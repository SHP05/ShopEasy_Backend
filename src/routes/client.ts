import { Router } from 'express';
import {
  createClient,
  delteClient,
  getClients,
  searchClient,
  updateClient,
} from '../controllers/client';

export const router = Router();

router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', delteClient);
router.get('/search', searchClient);
router.get('/:userId', getClients);
