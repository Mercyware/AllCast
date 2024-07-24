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


        it('should throw an error if domain is invalid', async () => {
            isValidDomain.mockReturnValue(false);

            await expect(DomainService.bookDomain('invalid', 'user@example.com')).rejects.toThrow('Invalid domain');
        });


    });

    describe('checkAvailability', () => {


        it('should throw an error for an invalid domain', async () => {
            isValidDomain.mockReturnValue(false);

            await expect(DomainService.checkAvailability('invalid')).rejects.toThrow('Invalid domain');
        });
    });


});