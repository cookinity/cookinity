import { Router } from 'express';
import bookingRoutes from './booking';
import usersRoutes from './users';
import classRoutes from './classes';
import paymentRoutes from './payment';
const router = Router();

router.use('/users', usersRoutes);
router.use('/classes', classRoutes);
router.use('/payment', paymentRoutes);
router.use('/bookings', bookingRoutes);

export default router;
