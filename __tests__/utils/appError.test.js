import AppError from '../../src/utils/AppError';

describe('AppError', () => {
    it('should create an error with the correct message and status code', () => {
        const message = 'Test error message';
        const statusCode = 404;
        const error = new AppError(message, statusCode);

        expect(error.message).toBe(message);
        expect(error.statusCode).toBe(statusCode);
        expect(error.status).toBe('fail');
        expect(error.isOperational).toBe(true);
    });

    it('should create an error with status "error" for non-4xx status codes', () => {
        const message = 'Test error message';
        const statusCode = 500;
        const error = new AppError(message, statusCode);

        expect(error.message).toBe(message);
        expect(error.statusCode).toBe(statusCode);
        expect(error.status).toBe('error');
        expect(error.isOperational).toBe(true);
    });

    it('should capture the stack trace', () => {
        const message = 'Test error message';
        const statusCode = 400;
        const error = new AppError(message, statusCode);

        expect(error.stack).toContain('Error');
    });
});
