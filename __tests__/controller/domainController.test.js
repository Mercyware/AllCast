// src/controllers/__tests__/domainController.test.js

import { checkAvailability, bookDomain } from '../../src/controllers/domainController';
import { DomainService } from '../../src/services/domainService';
import AppError from '../../src/utils/AppError';
import logger from '../../src/utils/logger';

// Mock the dependencies
jest.mock('../../src/services/domainService');
jest.mock('../../src/utils/logger');

describe('domainController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('checkAvailability', () => {
        it('should return 400 if domain is not provided', async () => {
            await checkAvailability(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Domain is required' });
        });

        it('should return 200 with result if domain is available', async () => {
            req.body.domain = 'example.com';
            const mockResult = { available: true };
            DomainService.checkAvailability.mockResolvedValue(mockResult);

            await checkAvailability(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Validation successful',
                result: mockResult
            });
        });

        it('should return 400 if an error occurs', async () => {
            req.body.domain = 'example.com';
            const errorMessage = 'Domain check failed';
            DomainService.checkAvailability.mockRejectedValue(new Error(errorMessage));

            await checkAvailability(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('bookDomain', () => {
        it('should return 400 if domain or email is not provided', async () => {
            await bookDomain(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Domain and email are required' });
        });

        it('should return 201 with booking details if domain is booked successfully', async () => {
            req.body = { domain: 'example.com', email: 'user@example.com' };
            const mockBooking = { id: '123', domain: 'example.com', email: 'user@example.com' };
            DomainService.bookDomain.mockResolvedValue(mockBooking);

            await bookDomain(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Domain booked successfully',
                booking: mockBooking
            });
        });

        it('should return 400 if an error occurs during booking', async () => {
            req.body = { domain: 'example.com', email: 'user@example.com' };
            const errorMessage = 'Booking failed';
            DomainService.bookDomain.mockRejectedValue(new Error(errorMessage));

            await bookDomain(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});