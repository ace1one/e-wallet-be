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
import clerkMiddleware from './middleware/clerkMiddleware.js';

    if (!globalThis.fetch) {
        globalThis.fetch = fetch;
    }

dotenv.config();

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



job.start();



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
       


