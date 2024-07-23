import express from 'express';
import cors from 'cors';
import morgan from 'morgan';


// Import routes
import paymentRoutes from './routes/paymentRoutes.js';
import domainRoutes from './routes/domainRoutes.js';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/domain', domainRoutes);


// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;