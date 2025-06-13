 import express from 'express';
 import dotenv from 'dotenv';
 import fetch from 'node-fetch';
 import { initializeDatabase } from './db/index.js';
 import routes from './routes/index.js';
 import job from './lib/corn.js';
 import  categorySeeder  from "./routes/category-seeder.js";
 import cors from 'cors';
 import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import clerkWebhookRoute from './routes/clerkWebhookRoute.js'; 

    if (!globalThis.fetch) {
        globalThis.fetch = fetch;
    }

dotenv.config();
const jwks = jwksClient({
    jwksUri: process.env.CLERK_JWKS_URL,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10
});
const PORT = process.env.PORT || 3000;

const app =  express();
app.use(cors({
    origin: '*', // Allow all origins for mobile apps; replace with 'your.app://' for specific scheme
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies (except for webhook)
app.use((req, res, next) => {
    if (req.path === '/webhook') {
        return next(); // Skip JSON parsing for webhook (handled in clerkWebhookRoute)
    }
    express.json()(req, res, next);
});
// const clerk = new Clerk({
//     secretKey: process.env.CLERK_SECRET_KEY,
//     jwtKey: process.env.CLERK_JWT_KEY // JWT public key for "mobile" template
// });



job.start();


// Middleware to validate JWT for "mobile" template
app.use('/api', async (req, res, next) => {
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
});

// Mount webhook route (no clerkMiddleware)
app.use('/webhook', clerkWebhookRoute);
app.use('/api', categorySeeder);
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello, World!!');
});


// Initialize the database
initializeDatabase()
    .then(() => {
        app.listen(3000, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
       


