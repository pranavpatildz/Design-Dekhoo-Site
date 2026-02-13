const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
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

// Declare app and PORT globally
const app = express();
const PORT = process.env.PORT || 3000;

// Set up view engine and views directory - MUST be before any routes or middleware that renders views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing middleware - Must be before routes that need to parse body
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Apply security headers
app.use(helmet());

// Cookie parsing middleware
app.use(cookieParser());

// Serve static files from the 'public' directory - After body parsers
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoutes = require('./backend/src/routes/auth');
const catalogRoutes = require('./backend/src/routes/catalog');
const categoryRoutes = require('./backend/src/routes/category');
const dashboardApiRoutes = require('./backend/src/routes/dashboard'); // Renamed for clarity: it's an API router
const uploadRoutes = require('./backend/src/routes/upload');

// === API Routes ===
// Mount API routes under the /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardApiRoutes);
app.use('/api/upload', uploadRoutes);

// === View Routes ===
// Define routes that render EJS templates
// Root route renders the home page
app.get('/', (req, res) => {
    res.render('home', { title: 'DesignDekhoo Home' });
});

// Explore page
app.get('/explore', (req, res) => {
    res.render('explore', { title: 'Explore Dekhoo' });
});

// Login page
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Public Catalog page
app.get('/public-catalog', (req, res) => {
    res.render('public-catalog', { title: 'Public Catalog' });
});

// Shop Dashboard page
app.get('/shop-dashboard', (req, res) => {
    // This route would typically require authentication middleware before rendering
    // For now, assuming it's accessible or handled by client-side auth.
    // Temporary fallback user object if no authentication middleware is present
    const user = {
        shopName: "DesignDekhoo Store",
        name: "Owner Demo" // Changed ownerName to name as per ejs file usage
    };
    res.render('shop-dashboard', { title: 'Shop Dashboard', user });
});

// === Error Handling Middleware ===
// These should always be the last middleware functions added to the app.
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
