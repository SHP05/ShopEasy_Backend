import { Router } from 'express';
import { createClient, delteClient, updateClient } from '../controllers/client';

export const router = Router();

router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', delteClient);
