import { Router } from 'express';
import { getRoomList } from '../data/store';

const router = Router();

router.get('/rooms', (req, res) => {
  res.json(getRoomList());
});

export default router; 