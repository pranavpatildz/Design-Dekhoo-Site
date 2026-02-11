const app = require('./app');
// const connectDB = require('./config/database'); // DB connection now handled in app.js
require('dotenv').config();

const port = process.env.PORT || 8000; // This port is not used anymore

// (async () => {
//   await connectDB(); // DB connection now handled in app.js
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// })();

