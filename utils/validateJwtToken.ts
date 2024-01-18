import jwt from 'jsonwebtoken';

export function verifyJwtToken(token: string): boolean {
    try {
        const key = process.env.JWT_AUTH_SECRET_KEY as string;
        const decoded = jwt.verify(token, key);
        // Optionally, use the decoded data
        return true;
    } catch (err) {
        console.error('JWT validation error:', err);
        return false;
    }
}
