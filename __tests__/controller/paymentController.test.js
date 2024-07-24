// src/controllers/__tests__/paymentController.test.js

import { checkOutOrder, verifyPayment } from '../../src/controllers/paymentController';
import PaymentService from '../../src/services/paymentService';
import AppError from '../../src/utils/AppError';
import logger from '../../src/utils/logger';

// Mock the dependencies
jest.mock('../../src/services/paymentService');
jest.mock('../../src/utils/logger');

describe('paymentController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('checkOutOrder', () => {
        it('should throw an error if transaction_id, amount, or email is missing', async () => {
            await checkOutOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Transaction ID, amount and email are required' });
        });

        it('should return 201 with booking details if payment is initialized successfully', async () => {
            req.body = { transaction_id: '123', amount: 100, email: 'user@example.com' };
            const mockResult = { id: '123', status: 'success' };
            PaymentService.checkOutOrder.mockResolvedValue(mockResult);

            await checkOutOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ booking: mockResult });
        });

        it('should return 400 if an error occurs during payment initialization', async () => {
            req.body = { transaction_id: '123', amount: 100, email: 'user@example.com' };
            const errorMessage = 'Payment initialization failed';
            PaymentService.checkOutOrder.mockRejectedValue(new Error(errorMessage));

            await checkOutOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('verifyPayment', () => {
        it('should throw an error if reference is missing', async () => {
            await expect(verifyPayment(req, res)).rejects.toThrow('Transaction reference is required');
        });

        it('should return verification result if reference is provided', async () => {
            req.params.reference = 'ref123';
            const mockResult = { status: 'success', amount: 100 };
            PaymentService.verifyTransaction.mockResolvedValue(mockResult);

            await verifyPayment(req, res);

            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should throw an error if verification fails', async () => {
            req.params.reference = 'ref123';
            const errorMessage = 'Verification failed';
            PaymentService.verifyTransaction.mockRejectedValue(new Error(errorMessage));

            await expect(verifyPayment(req, res)).rejects.toThrow(errorMessage);
        });
    });
});