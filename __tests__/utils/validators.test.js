import { isValidEmail, stripDomain, isValidDomain } from '../../src/utils/validators';

describe('Validator Utils', () => {
    describe('isValidEmail', () => {
        it('should return true for a valid email', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
        });

        it('should return false for an invalid email', () => {
            expect(isValidEmail('test@.com')).toBe(false);
            expect(isValidEmail('test@com')).toBe(false);
            expect(isValidEmail('test.com')).toBe(false);
            expect(isValidEmail('')).toBe(false);
            expect(isValidEmail(null)).toBe(false);
            expect(isValidEmail(undefined)).toBe(false);
        });
    });

    describe('stripDomain', () => {
        it('should strip http:// from the domain', () => {
            expect(stripDomain('http://example.com')).toBe('example.com');
        });

        it('should strip https:// from the domain', () => {
            expect(stripDomain('https://example.com')).toBe('example.com');
        });

        it('should strip www. from the domain', () => {
            expect(stripDomain('www.example.com')).toBe('example.com');
        });

        it('should strip http:// and www. from the domain', () => {
            expect(stripDomain('http://www.example.com')).toBe('example.com');
        });

        it('should strip https:// and www. from the domain', () => {
            expect(stripDomain('https://www.example.com')).toBe('example.com');
        });

        it('should not alter domains without protocols or www', () => {
            expect(stripDomain('example.com')).toBe('example.com');
        });
    });

    describe('isValidDomain', () => {
        it('should return true for a valid domain', () => {
            expect(isValidDomain('example.com')).toBe(true);
        });

        it('should return true for a valid domain with http', () => {
            expect(isValidDomain('http://example.com')).toBe(true);
        });

        it('should return true for a valid domain with https', () => {
            expect(isValidDomain('https://example.com')).toBe(true);
        });

        it('should return true for a valid domain with www', () => {
            expect(isValidDomain('www.example.com')).toBe(true);
        });

        it('should return true for a valid domain with https and www', () => {
            expect(isValidDomain('https://www.example.com')).toBe(true);
        });

        it('should return false for an invalid domain', () => {
            expect(isValidDomain('example')).toBe(false);
            expect(isValidDomain('example.c')).toBe(false);
            expect(isValidDomain('example..com')).toBe(false);
            expect(isValidDomain('example-.com')).toBe(false);
            expect(isValidDomain('-example.com')).toBe(false);
            expect(isValidDomain('')).toBe(false);
            expect(isValidDomain(null)).toBe(false);
            expect(isValidDomain(undefined)).toBe(false);
        });
    });
});
