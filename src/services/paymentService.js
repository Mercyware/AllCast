// src/services/paymentService.js
import axios from 'axios';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

class PaymentService {
    constructor() {
        this.baseURL = process.env.PAYSTACK_BASE_URL;
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    }

    async checkOutOrder(transaction_id, amount, email) {

        try {
            const result = await this.initializeTransaction(amount, email);
            logger.info(`Payment initialized for ${email} with amount ${amount}`);
            console.log(result);

        } catch (error) {
            logger.error('Error checking out:', { error: error.message, stack: error.stack });
            throw new AppError('Failed to checkout', 500);
        }
    }
    async initializeTransaction(amount, email) {
        this.#validateSecretKey();

        try {
            logger.info(`Initializing transaction for ${email} with amount ${amount}`);

            const response = await axios.post(`${this.baseURL}/transaction/initialize`, {
                amount: amount * 100,
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
        this.#validateSecretKey();
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

    #validateSecretKey() {
        console.log(this.baseURL, this.secretKey);
        if (!this.secretKey) {
            logger.error('Paystack secret key is required');
            throw new AppError('Something went wrong', 500);
        }

    }
}

export default new PaymentService();