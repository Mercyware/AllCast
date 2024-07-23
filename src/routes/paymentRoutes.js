// src/routes/paymentRoutes.js

import express from 'express';
import { checkOutOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout', checkOutOrder);
router.get('/verify/:reference', verifyPayment);

export default router;