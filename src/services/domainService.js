// src/services/domainService.js

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';
import { isValidDomain, stripDomain } from '../utils/validators.js';
import { getBookings, saveBookings } from '../utils/fileStore.js';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

export class DomainService {
    static async getBookings() {
        try {
            await fs.mkdir(path.dirname(BOOKINGS_FILE), { recursive: true });
            const data = await fs.readFile(BOOKINGS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    static async saveBookings(bookings) {
        await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    }

    static async bookDomain(domain, email) {
        try {
            if (!domain || !isValidDomain(domain)) {
                logger.error('Invalid domain: ' + domain);
                throw new AppError('Invalid domain', 400);
            }

            if (!email) {
                logger.error('Email is required');
                throw new AppError('Email is required', 400);
            }

            const stripped_domain = stripDomain(domain);
            const bookings = await getBookings();

            // Check if the domain is already booked and pending
            const existingBooking = bookings.find(booking => booking.domain === stripped_domain && booking.status === 'pending');
            if (existingBooking) {
                logger.info('Domain already booked and pending: ' + domain);
                return existingBooking;
            }

            // Check if the domain is booked (not cancelled)
            if (bookings.some(booking => booking.domain === stripped_domain && booking.status !== 'cancelled')) {
                logger.error('Domain is already booked: ' + domain);
                throw new AppError('Domain is already booked', 400);
            }

            // Create a new booking
            const newBooking = {
                id: uuidv4(),
                domain: stripped_domain,
                email,
                status: 'pending',
                payment_reference_id: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            bookings.push(newBooking);
            await saveBookings(bookings);

            logger.info(`Domain booked: ${domain} for ${email}`);
            return newBooking;
        } catch (error) {
            logger.error('Error booking domain:', error);
            throw error;
        }
    }


    static async checkAvailability(domain) {
        logger.info(`Checking availability of domain ${domain}`);

        try {
            if (!domain || !isValidDomain(domain)) {
                throw new AppError('Invalid domain', 400);
            }

            const isAvailable = await this.isDomainAvailable(domain);
            return { domain, available: isAvailable, price: 20000, currency: "NGN" };
        } catch (error) {
            logger.error('Error checking domain availability:', error);
            throw error;
        }
    }

    static async isDomainAvailable(domain) {
        const bookings = await this.getBookings();
        return !bookings.some(booking => booking.domain === domain && booking.status !== 'cancelled');
    }
}