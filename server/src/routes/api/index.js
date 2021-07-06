import { Router } from 'express';
import usersRoutes from './users';
import classRoutes from './classes';
import paymentRoutes from './payment';
import bookingRoutes from './booking';
const router = Router();

router.use('/users', usersRoutes);
router.use('/classes', classRoutes);
router.use('/payment', paymentRoutes);
router.use('/bookings', bookingRoutes);

export default router;
