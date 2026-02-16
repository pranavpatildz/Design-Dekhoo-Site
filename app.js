const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Require express-session
const MongoStore = require('connect-mongo'); // Require connect-mongo
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./backend/src/config/database');
const { notFound, errorHandler } = require('./backend/src/middleware/errorMiddleware');
const { protect } = require('./backend/src/middleware/auth'); // Import protect
const ShopOwner = require('./backend/src/models/ShopOwner'); // Import ShopOwner model
const Furniture = require('./backend/src/models/Furniture'); // Import Furniture model
const Category = require('./backend/src/models/Category'); // Import Category model
const Material = require('./backend/src/models/Material'); // Import Material model

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

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: {
        secure: false, // Set to false for local development over HTTP
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));



// Set Cache-Control header to prevent caching of authenticated pages
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Serve static files from the 'public' directory - After body parsers
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoutes = require('./backend/src/routes/auth');
const catalogRoutes = require('./backend/src/routes/catalog');
const categoryRoutes = require('./backend/src/routes/category');
const dashboardApiRoutes = require('./backend/src/routes/dashboard'); // Renamed for clarity: it's an API router
const uploadRoutes = require('./backend/src/routes/upload');
const productRoutes = require('./backend/src/routes/productRoutes');

// === API Routes ===
// Mount API routes under the /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardApiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);

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
    res.render('login', { title: 'Login', activeTab: 'login' });
});

// Signup page (renders the same EJS file as login, as signup form is within it)
app.get('/signup', (req, res) => {
    res.render('login', { title: 'Sign Up', activeTab: 'signup' });
});

// Forgot Password page
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
});

// Public Catalog page
app.get('/public-catalog', (req, res) => {
    res.render('public-catalog', { title: 'Public Catalog' });
});

// Shop Dashboard page (summary only)
app.get('/shop-dashboard', protect, async (req, res) => {
    try {
        const defaultCategoryNames = [
            "Sofa",
            "Chair",
            "Table",
            "Bed",
            "Wardrobe",
            "Cabinet",
            "TV Unit",
            "Dining Set",
            "Study Table",
            "Bookshelf",
            "Recliner",
            "Coffee Table",
            "Side Table",
            "Dressing Table",
            "Office Chair"
        ];

        const defaultMaterialNames = [
            "Solid Wood",
            "Engineered Wood",
            "Teak Wood",
            "Sheesham Wood",
            "MDF",
            "Plywood",
            "Metal",
            "Stainless Steel",
            "Aluminium",
            "Glass",
            "Tempered Glass",
            "Plastic",
            "Fabric",
            "Velvet",
            "Leather",
            "Faux Leather",
            "Marble",
            "Granite",
            "Rattan",
            "Cane"
        ];

        // Fetch categories and materials initially
        let categories = await Category.find({ shopOwnerId: req.user._id });
        let materials = await Material.find({ shopOwnerId: req.user._id });

        // Auto-seed default categories if collection is empty for this shop
        if (categories.length === 0) {
            const categoriesToInsert = defaultCategoryNames.map(name => ({ name, shopOwnerId: req.user._id }));
            await Category.insertMany(categoriesToInsert);
            categories = await Category.find({ shopOwnerId: req.user._id }); // Re-fetch updated list
            console.log("Default categories seeded for shop owner:", req.user._id);
        }

        // Auto-seed default materials if collection is empty for this shop
        if (materials.length === 0) {
            const materialsToInsert = defaultMaterialNames.map(name => ({ name, shopOwnerId: req.user._id }));
            await Material.insertMany(materialsToInsert);
            materials = await Material.find({ shopOwnerId: req.user._id }); // Re-fetch updated list
            console.log("Default materials seeded for shop owner:", req.user._id);
        }
        
        // Fetch products and calculate totals after ensuring defaults
        const products = await Furniture.find({ shopOwnerId: req.user._id });
        const totalProducts = products.length;
        const totalCategories = categories.length;
        res.render('shop-dashboard', {
            title: 'Shop Dashboard',
            user: req.user,
            categories,
            materials, // Pass materials
            products, // Pass products
            totalProducts, // Pass totalProducts
            totalCategories // Pass totalCategories
        });
    } catch (error) {
        console.error('Error fetching data for shop dashboard:', error);
        res.status(500).render('shop-dashboard', {
            title: 'Shop Dashboard',
            user: req.user,
            categories: [],
            materials: [], // Pass empty materials array on error
            products: [],
            totalProducts: 0,
            totalCategories: 0
        });
    }
});



// Reset Password page (with token validation)
app.get('/reset-password/:token', async (req, res) => {
    try {
        const shopOwner = await ShopOwner.findOne({
            resetToken: req.params.token,
            resetTokenExpire: { $gt: Date.now() } // Token not expired
        });

        if (!shopOwner) {
            // If token is invalid or expired, redirect to forgot password with an error
            // For now, just redirect. In a real app, you might want to flash a message.
            return res.redirect('/forgot-password');
        }

        // Render the reset password page, passing the token
        res.render('reset-password', { title: 'Reset Password', token: req.params.token });
    } catch (err) {
        console.error('Error validating reset token:', err.message);
        res.redirect('/forgot-password'); // Redirect on server error
    }
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
