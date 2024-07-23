// src/routes/domainRoutes.js

import express from 'express';
import { bookDomain, updateBookingStatus, checkAvailability } from '../controllers/domainController.js';

const router = express.Router();

router.post('/book', bookDomain);
router.patch('/:id/status', updateBookingStatus);
router.get('/availability', checkAvailability);

export default router;