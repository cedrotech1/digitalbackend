import express from 'express';

import docrouter from '../documentation/index.doc.js';
import userRouter from './userRouter.js';
import authRouter from './authRouter.js';
import notification from './notificationRouter.js';
import Address from './AddressRouter.js';
import HealthCenters from './HealthCenterRouter.js';
import Born from './bornsRoutes.js';
import babies from './babiesRoutes.js';
import Appoitment from './appointmentRoutes.js';
import AppointmentFeedbacks from './appointmentFeedbackRoutes.js';

const router = express.Router();

router.use('/docs', docrouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/healthcenters', HealthCenters);
router.use('/appointments', Appoitment);
router.use('/appointmentFeedbacks', AppointmentFeedbacks);
router.use('/borns', Born);
router.use('/babies', babies);
router.use('/address', Address);
router.use('/notification', notification);




export default router;
