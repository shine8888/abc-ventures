import express from 'express';
import AdminRoute from './Admin';

const router = express.Router();

router.use('/admin', AdminRoute);

export default router;
