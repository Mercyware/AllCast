// src/routes/domainRoutes.js

import express from 'express';
import { bookDomain, checkAvailability } from '../controllers/domainController.js';

const router = express.Router();

router.post('/book', bookDomain);
router.get('/availability', checkAvailability);

export default router;