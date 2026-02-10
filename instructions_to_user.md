It appears that your Node.js application is still picking up an outdated `MONGODB_URI` environment variable, even though the `.env` file is correct and we've added the DNS configuration. This is often due to environment variable caching in your terminal session.

To ensure a clean environment, please follow these steps precisely:

1.  **Close ALL currently open terminal/command prompt windows** where you might have run `npm start`.
2.  **Open a brand new terminal or command prompt window.**
3.  Navigate to your project directory: `cd "D:\Furniture Site\design-dekhoo"`
4.  **Run `npm start` again.**

This should force the system to load all environment variables afresh, including the correct `MONGODB_URI` from your `.env` file.