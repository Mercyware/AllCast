// src/controllers/domainBookingController.js

import { DomainService } from '../services/domainService.js';
import AppError from '../utils/AppError.js';
import asyncHandler from 'express-async-handler';
import logger from '../utils/logger.js';

export const checkAvailability = async (req, res) => {
    const { domain } = req.body;

    logger.info(`ValidationController: Input received to validate domain ${domain}`);

    try {
        if (!domain) {
            logger.error('ValidationController: Domain  is required');
            return res.status(400).json({ error: 'Domain is required' });
        }

        const result = await DomainService.checkAvailability(domain);

        res.status(200).json({
            message: 'Validation successful',
            result
        });
    } catch (error) {
        logger.error('Error validating domain:', error);
        res.status(400).json({ error: error.message });
    }
}

export const bookDomain = asyncHandler(async (req, res) => {
    const { domain, email } = req.body;
    logger.info(`ValidationController: Input received to validate domain ${domain} for ${email}`);

    try {
        if (!domain || !email) {
            logger.error('Domain and email are required');
            throw new AppError('Domain and email are required', 400);
        }

        const booking = await DomainService.bookDomain(domain, email);
        res.status(201).json({
            message: 'Domain booked successfully',
            booking
        });
    } catch (error) {
        logger.error('Error booking domain:', error);
        res.status(400).json({ error: error.message });
    }
});
