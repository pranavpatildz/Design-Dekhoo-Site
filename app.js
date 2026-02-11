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

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Import API Routes
const authRoutes = require('./backend/src/routes/auth');
const catalogRoutes = require('./backend/src/routes/catalog');
const categoryRoutes = require('./backend/src/routes/category');
const dashboardRoutes = require('./backend/src/routes/dashboard');
const uploadRoutes = require('./backend/src/routes/upload');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// View Routes
// Root route redirection
app.get('/', (req, res) => {
    res.redirect('/explore'); // Redirect to the main public catalog page
});

app.get('/explore', (req, res) => {
    res.render('explore', { title: 'Explore Dekhoo' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/public-catalog', (req, res) => {
    res.render('public-catalog', { title: 'Public Catalog' });
});

// The dashboard route to render the EJS view
app.get('/shop-dashboard', (req, res) => {
    // This route would typically require authentication middleware before rendering
    // For now, assuming it's accessible or handled by client-side auth.
    res.render('shop-dashboard', { title: 'Shop Dashboard' });
});


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