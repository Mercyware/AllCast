import fs from 'fs/promises';
import path from 'path';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

export const getBookings = async() =>{
    try {
        await fs.mkdir(path.dirname(BOOKINGS_FILE), { recursive: true });
        const data = await fs.readFile(BOOKINGS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

export const saveBookings = async(bookings) => {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}