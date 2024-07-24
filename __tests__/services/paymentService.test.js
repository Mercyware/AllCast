// src/services/__tests__/paymentService.test.js

import paymentService from '../../src/services/paymentService';
import axios from 'axios';
import AppError from '../../src/utils/AppError';
import { getBookings, saveBookings } from '../../src/utils/fileStore';

jest.mock('axios');
jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/fileStore');

describe('PaymentService', () => {
    beforeEach(() => {
        process.env.PAYSTACK_BASE_URL = 'https://api.paystack.co';
        process.env.PAYSTACK_SECRET_KEY = 'sk_test_1234567890';
        // Call validateConfig to ensure the service is properly initialized
        paymentService.validateConfig();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });



    describe('checkOutOrder', () => {
        it('should successfully check out an order', async () => {
            const mockTransaction = { status: true, data: { reference: 'ref123' } };
            const mockBookings = [{ id: 'transaction_id', status: 'pending' }];

            axios.post.mockResolvedValue({ data: mockTransaction });
            getBookings.mockResolvedValue(mockBookings);

            const result = await paymentService.checkOutOrder('transaction_id', 1000, 'test@example.com');

            expect(result).toEqual({
                id: 'transaction_id',
                status: 'paid',
                payment_reference_id: 'ref123',
                updatedAt: expect.any(String)
            });
            expect(saveBookings).toHaveBeenCalled();
        });


    });

    describe('initializeTransaction', () => {
        it('should initialize a transaction successfully', async () => {
            const mockResponse = { data: { status: true, data: { reference: 'ref123' } } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await paymentService.initializeTransaction(1000, 'test@example.com');

            expect(result).toEqual(mockResponse.data);
            expect(axios.post).toHaveBeenCalledWith(
                'https://api.paystack.co/transaction/initialize',
                { amount: 100000, email: 'test@example.com' },
                expect.any(Object)
            );
        });

        it('should handle errors when initializing transaction', async () => {
            axios.post.mockRejectedValue(new Error('Network error'));

            await expect(paymentService.initializeTransaction(1000, 'test@example.com'))
                .rejects.toThrow('Failed to initialize payment');
        });
    });

    describe('verifyTransaction', () => {
        it('should verify a transaction successfully', async () => {
            const mockResponse = { data: { status: true, data: { amount: 1000 } } };
            axios.get.mockResolvedValue(mockResponse);

            const result = await paymentService.verifyTransaction('ref123');

            expect(result).toEqual(mockResponse.data);
            expect(axios.get).toHaveBeenCalledWith(
                'https://api.paystack.co/transaction/verify/ref123',
                expect.any(Object)
            );
        });

        it('should handle errors when verifying transaction', async () => {
            axios.get.mockRejectedValue(new Error('Network error'));

            await expect(paymentService.verifyTransaction('ref123'))
                .rejects.toThrow('Failed to verify payment');
        });
    });
});;