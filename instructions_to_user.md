
To complete the MongoDB Atlas connection fix, please follow these steps:

1.  **Create a `.env` file:** In the root directory of your project (D:\Furniture Site\design-dekhoo), create a new file named `.env`.
2.  **Copy contents from `.env.example`:** Copy all the content from the newly created `.env.example` file into your new `.env` file.
3.  **Update `MONGO_URI`:** In your `.env` file, replace `<username>`, `<password>`, and `<cluster-name>` with your actual MongoDB Atlas credentials.
    *   Make sure `designdekhoo-cluster` is your database name.
    *   The `appName=Design%20Dekhoo` parameter has been added for better connection monitoring.
    *   Example: `mongodb+srv://your_username:your_password@your_cluster_name.mongodb.net/designdekhoo-cluster?retryWrites=true&w=majority&appName=Design%20Dekhoo`
4.  **Update other secrets:** Fill in your actual `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the `.env` file.
5.  **Restart your application:** After updating the `.env` file, restart your Node.js application for the changes to take effect.

I have updated the `backend/src/config/database.js` to include `useNewUrlParser: true` and `useUnifiedTopology: true` for modern Mongoose practices. The server startup logic in `app.js` already ensures that the server only starts after a successful database connection, including a retry mechanism.
