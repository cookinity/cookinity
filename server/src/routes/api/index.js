import { Router } from 'express';
import usersRoutes from './users';
import classRoutes from './classes';
const router = Router();

router.use('/users', usersRoutes);
router.use('/classes', classRoutes);

export default router;
