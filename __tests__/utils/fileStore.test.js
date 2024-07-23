import fs from 'fs/promises';
import path from 'path';
import { getBookings, saveBookings } from '../../src/utils/fileStore.js';

jest.mock('fs/promises');

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

describe('Bookings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getBookings', () => {
        it('should return bookings from the file if it exists', async () => {
            const mockBookings = [{ id: 1, name: 'Test Booking' }];
            fs.readFile.mockResolvedValue(JSON.stringify(mockBookings));

            const bookings = await getBookings();

            expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(BOOKINGS_FILE), { recursive: true });
            expect(fs.readFile).toHaveBeenCalledWith(BOOKINGS_FILE, 'utf8');
            expect(bookings).toEqual(mockBookings);
        });

        it('should return an empty array if the file does not exist', async () => {
            fs.readFile.mockRejectedValue({ code: 'ENOENT' });

            const bookings = await getBookings();

            expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(BOOKINGS_FILE), { recursive: true });
            expect(fs.readFile).toHaveBeenCalledWith(BOOKINGS_FILE, 'utf8');
            expect(bookings).toEqual([]);
        });

        it('should throw an error for other errors', async () => {
            const error = new Error('Test error');
            fs.readFile.mockRejectedValue(error);

            await expect(getBookings()).rejects.toThrow(error);

            expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(BOOKINGS_FILE), { recursive: true });
            expect(fs.readFile).toHaveBeenCalledWith(BOOKINGS_FILE, 'utf8');
        });
    });

    describe('saveBookings', () => {
        it('should save bookings to the file', async () => {
            const mockBookings = [{ id: 1, name: 'Test Booking' }];

            await saveBookings(mockBookings);

            expect(fs.writeFile).toHaveBeenCalledWith(
                BOOKINGS_FILE,
                JSON.stringify(mockBookings, null, 2)
            );
        });
    });
});
