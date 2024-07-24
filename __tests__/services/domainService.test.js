import { DomainService } from '../../src/services/domainService';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../../src/utils/AppError';
import { isValidDomain, stripDomain } from '../../src/utils/validators';
import { getBookings, saveBookings } from '../../src/utils/fileStore';

jest.mock('fs/promises');
jest.mock('path');
jest.mock('uuid', () => ({
    v4: jest.fn()
}));
jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/validators');
jest.mock('../../src/utils/fileStore');

describe('DomainService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe('bookDomain', () => {
        it('should book a domain successfully', async () => {
            const domain = 'example.com';
            const email = 'user@example.com';
            isValidDomain.mockReturnValue(true);
            stripDomain.mockReturnValue(domain);
            getBookings.mockResolvedValue([]);
            uuidv4.mockReturnValue('mock-uuid');

            const result = await DomainService.bookDomain(domain, email);

            expect(result).toMatchObject({
                id: 'mock-uuid',
                domain,
                email,
                status: 'pending',
            });
            expect(saveBookings).toHaveBeenCalled();
        });

        it('should throw an error if domain is invalid', async () => {
            isValidDomain.mockReturnValue(false);

            await expect(DomainService.bookDomain('invalid', 'user@example.com')).rejects.toThrow('Invalid domain');
        });

        it('should throw an error if domain is already booked', async () => {
            isValidDomain.mockReturnValue(true);
            stripDomain.mockReturnValue('example.com');
            getBookings.mockResolvedValue([{ domain: 'example.com', status: 'pending' }]);

            await expect(DomainService.bookDomain('example.com', 'user@example.com')).rejects.toThrow('Domain is already booked');
        });
    });

    describe('checkAvailability', () => {
        it('should return availability status for a valid domain', async () => {
            const domain = 'example.com';
            isValidDomain.mockReturnValue(true);
            DomainService.isDomainAvailable = jest.fn().mockResolvedValue(true);

            const result = await DomainService.checkAvailability(domain);

            expect(result).toEqual({ domain, available: true });
        });

        it('should throw an error for an invalid domain', async () => {
            isValidDomain.mockReturnValue(false);

            await expect(DomainService.checkAvailability('invalid')).rejects.toThrow('Invalid domain');
        });
    });

    describe('isDomainAvailable', () => {
        it('should return true if domain is available', async () => {
            getBookings.mockResolvedValue([]);

            const result = await DomainService.isDomainAvailable('example.com');

            expect(result).toBe(true);
        });
    });
});