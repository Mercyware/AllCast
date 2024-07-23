// src/controllers/paymentController.js

import AppError from '../utils/AppError.js';
import asyncHandler from 'express-async-handler';
import PaymentService from '../services/paymentService.js';
import logger from '../utils/logger.js';

export const checkOutOrder = asyncHandler(async (req, res) => {
    const { transaction_id, amount, email } = req.body;
    logger.info(`PaymentController: Input received to initialize payment for ${email} with amount ${amount} for transaction ${transaction_id}`);

    try {
        if (!transaction_id || !amount || !email) {
            logger.error('Transaction ID, amount and email are required');
            throw new AppError('Transaction ID, amount and email are required', 400);
        }

        logger.info(`PaymentController: Initializing payment for ${email} with amount ${amount}`);
        const result = await PaymentService.checkOutOrder(transaction_id, amount, email);
        res.status(201).json({
            booking: result
        });

    } catch (error) {
        logger.error('Error initializing payment:', error);
        res.status(400).json({ error: error.message });
    }
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { reference } = req.params;
    logger.info(`PaymentController: Input received to verify payment for  ${reference}`);

    if (!reference) {
        logger.error('PaymentController: Transaction reference is required');
        throw new AppError('Transaction reference is required', 400);
    }

    logger.info(`PaymentController: Verifying payment for ${reference}`);
    const result = await PaymentService.verifyTransaction(reference);
    res.json(result);
});