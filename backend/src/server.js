const app = require('./app');
const connectDB = require('./config/database');
require('dotenv').config();

const port = process.env.PORT || 8000;

(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
