 import express from 'express';
 import dotenv from 'dotenv';
 import fetch from 'node-fetch';
 import { initializeDatabase } from './db/index.js';
 import routes from './routes/index.js';
 import job from './lib/corn.js';

    if (!globalThis.fetch) {
        globalThis.fetch = fetch;
    }

dotenv.config();
const PORT = process.env.PORT || 3000;

const app =  express();

app.use(express.json());

job.start();

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
       


