const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./backend/src/config/database');
const { notFound, errorHandler } = require('./backend/src/middleware/errorMiddleware');

dotenv.config({ path: path.resolve(__dirname, '.env') });
// console.log('DB Connection String:', process.env.MONGO_URI); // Debug MONGO_URI - Removed
// console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO'); // Verify JWT_SECRET - Removed
// connectDB(); // Removed direct synchronous call

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ... (rest of your existing middleware and routes) ...

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    let retries = 5;
    while (retries) {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
            break; // Exit loop if connection is successful
        } catch (error) {
            console.error(`MongoDB connection failed. Retries left: ${retries - 1}`);
            console.error(`Error: ${error.message}`);
            retries--;
            await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
            if (retries === 0) {
                console.error('All MongoDB connection attempts failed. Exiting process.');
                process.exit(1); // Exit if no retries left
            }
        }
    }
};

startServer();
