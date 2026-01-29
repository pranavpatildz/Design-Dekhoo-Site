const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'DesignDekhoo - Curated Living Spaces' });
});

app.get('/explore', (req, res) => {
    res.render('explore', { title: 'Explore Furniture - DesignDekhoo' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login - DesignDekhoo' });
});

app.get('/shop-dashboard', (req, res) => {
    res.render('shop-dashboard', { title: 'Shop Owner Dashboard - DesignDekhoo' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
