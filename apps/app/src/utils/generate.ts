import { randomBytes } from 'crypto';
const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateInviteCode(length = 10): string {
    return Array.from({ length }, () => ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)]).join('')
}


/**
 * Generates a random alphanumeric string of given length.
 */
export function randomAlphaNumeric(length: number): string {
    const bytes = randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        // Map byte to 0-61
        const idx = bytes[i] % ALPHANUM.length;
        result += ALPHANUM[idx];
    }
    return result;
}