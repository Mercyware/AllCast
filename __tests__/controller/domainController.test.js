import { checkAvailability, bookDomain } from '../../src/controllers/domainController';
import { DomainService } from '../../src/services/domainService';
import AppError from '../../src/utils/AppError';
import logger from '../../src/utils/logger';

jest.mock('../../src/services/domainService');
jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/AppError');

describe('DomainBookingController', () => {
    describe('checkAvailability', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: { domain: 'example.com' }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            jest.clearAllMocks();
        });

        it('should validate domain availability and return success response', async () => {
            DomainService.checkAvailability.mockResolvedValue({ available: true });

            await checkAvailability(req, res);

            expect(logger.info).toHaveBeenCalledWith('ValidationController: Input received to validate domain example.com');
            expect(DomainService.checkAvailability).toHaveBeenCalledWith('example.com');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Validation successful',
                result: { available: true }
            });
        });

        it('should return error if domain is not provided', async () => {
            req.body.domain = '';

            await checkAvailability(req, res);

            expect(logger.error).toHaveBeenCalledWith('ValidationController: Domain  is required');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Domain is required' });
        });

        it('should handle errors and return error response', async () => {
            const error = new Error('Test error');
            DomainService.checkAvailability.mockRejectedValue(error);

            await checkAvailability(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error validating domain:', error);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('bookDomain', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: { domain: 'example.com', email: 'test@example.com' }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            jest.clearAllMocks();
        });

        it('should book domain and return success response', async () => {
            DomainService.bookDomain.mockResolvedValue({ domain: 'example.com', email: 'test@example.com' });

            await bookDomain(req, res);

            expect(logger.info).toHaveBeenCalledWith('ValidationController: Input received to validate domain example.com for test@example.com');
            expect(DomainService.bookDomain).toHaveBeenCalledWith('example.com', 'test@example.com');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Domain booked successfully',
                booking: { domain: 'example.com', email: 'test@example.com' }
            });
        });

        it('should return error if domain or email is not provided', async () => {
            req.body.domain = '';

            await expect(bookDomain(req, res)).rejects.toThrow('Domain and email are required');
            expect(logger.error).toHaveBeenCalledWith('Domain and email are required');
            expect(AppError).toHaveBeenCalledWith('Domain and email are required', 400);
        });

        it('should handle errors and return error response', async () => {
            const error = new Error('Test error');
            DomainService.bookDomain.mockRejectedValue(error);

            await expect(bookDomain(req, res)).rejects.toThrow('Test error');
            expect(logger.error).toHaveBeenCalledWith('Error booking domain:', error);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
