import dotenv from 'dotenv';
import app from './src/app.js';
import logger from './src/utils/logger.js';

// Load environment variables
dotenv.config();

// Set port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
});