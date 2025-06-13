import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const jwks = jwksClient({
    jwksUri: process.env.CLERK_JWKS_URL,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10
});
const clerkMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('[Backend] Token:', token);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        // Decode token to get key ID (kid)
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded || !decoded.header.kid) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch signing key from JWKS
        const key = await jwks.getSigningKey(decoded.header.kid);
        const publicKey = key.getPublicKey();

        // Verify token
        const verified = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: process.env.CLERK_ISSUER
        });

        req.auth = { userId: verified.sub }; // Attach user ID from token
        console.log('[Backend] Verified JWT:', verified);
        next();
    } catch (err) {
        console.error('[Backend] Token verification error:', err);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export default clerkMiddleware;