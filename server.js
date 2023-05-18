import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import { connectToDatabase } from './models/index.js';
import cors from 'cors';

// routes
import archiveRoutes from './routes/archives.js';
import attachmentRoutes from './routes/attachments.js';
import contactRoutes from './routes/contacts.js';
import feeRoutes from './routes/fees.js';
import jobRoutes from './routes/jobs.js';
import statusRoutes from './routes/statuses.js';
import userRoutes from './routes/users.js';

const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;

// express app
const app = express();
app.use(cors());


// middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/archives', archiveRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/users', userRoutes);

// connect to db
connectToDatabase(URI)
    .then(() => {
        // listen for requests
        app.listen(PORT, () => {
            console.log('Server started on port:', PORT);
        });
    })
    .catch((error) => {
        console.error(error);
    });

export default app;