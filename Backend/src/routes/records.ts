import { Router } from 'express';
import {
  createRecord,
  deleteRecord,
  updateRecord,
} from '../controllers/records';
export const router = Router();

router.post('/:cId/:sId', createRecord);
router.put('/:cId/:sId/:id', updateRecord);
router.delete('/:cId/:sId/:id', deleteRecord);
