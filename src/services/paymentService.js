// src/services/paymentService.js
import axios from 'axios';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { getBookings, saveBookings } from '../utils/fileStore.js';

// Load environment variables
dotenv.config();

class PaymentService {
    constructor() {
        this.baseURL = process.env.PAYSTACK_BASE_URL;
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
        this.validateConfig();
    }

    validateConfig() {
        if (!this.baseURL || !this.secretKey) {
            logger.error('Paystack base URL or secret key is missing in environment variables');
            throw new AppError('Payment service configuration error', 500);
        }
        logger.info('PaymentService configured successfully');
    }

    async checkOutOrder(transaction_id, amount, email) {
        try {
            const result = await this.initializeTransaction(amount, email);
            logger.info(`Payment initialized for ${email} with amount ${amount}`);

            const bookings = await getBookings();
            const bookingIndex = bookings.findIndex(booking => booking.id === transaction_id);

            if (bookingIndex === -1) {
                throw new AppError('Booking not found', 404);
            }

            const booking = bookings[bookingIndex];
            booking.updatedAt = new Date().toISOString();

            if (booking.status === 'pending') {
                if (result.status === true) {
                    booking.payment_reference_id = result.data.reference;
                    booking.status = 'paid';
                } else {
                    booking.status = 'failed';
                }

                bookings[bookingIndex] = booking;
                await saveBookings(bookings);
            }

            return booking;

        } catch (error) {
            logger.error('Error checking out:', { error: error.message, stack: error.stack });
            throw new AppError('Failed to checkout', 500);
        }
    }

    async initializeTransaction(amount, email) {
        try {
            logger.info(`Initializing transaction for ${email} with amount ${amount}`);

            const response = await axios.post(`${this.baseURL}/transaction/initialize`, {
                amount: amount * 100, // Convert to kobo
                email: email
            }, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json'
                }
            });

            logger.info(`Transaction initialized for ${email} with amount ${amount}`);
            return response.data;
        } catch (error) {
            logger.error('Error initializing Paystack transaction:', { error: error.message, stack: error.stack });
            throw new AppError('Failed to initialize payment', 500);
        }
    }

    async verifyTransaction(reference) {
        try {
            logger.info(`Verifying transaction: ${reference}`);
            const response = await axios.get(`${this.baseURL}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`
                }
            });

            logger.info(`Transaction verified: ${reference}`);
            return response.data;
        } catch (error) {
            logger.error('Error verifying Paystack transaction:', { error: error.message, stack: error.stack });
            throw new AppError('Failed to verify payment', 500);
        }
    }
}

const paymentService = new PaymentService();
export default paymentService;