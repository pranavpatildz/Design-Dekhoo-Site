# DesignDekhoo 🪑  
A Furniture Catalog & Showcase Platform

DesignDekhoo is a web-based platform that allows furniture shop owners to showcase their work digitally and share their catalog with customers using a simple link.

This project is **NOT an ecommerce platform**.  
There are no orders, payments, carts, or pricing logic.

---

## 🚀 Features

### 👤 Shop Owner
- Create and manage furniture catalogs
- Organize furniture section-wise:
  - Bedroom
  - Living Room
  - Dining
  - Kitchen
  - Office
  - Storage
  - Outdoor
  - Custom sections
- Upload multiple images per product
- Optional product descriptions (material, finish, notes)
- Share entire catalog via a public link
- Manage shop profile:
  - Shop name
  - Owner details
  - Contact information
  - Google Maps location
- Secure login & logout (JWT-based)

---

### 👀 Customers
- View shared public catalogs without login
- Browse furniture images category-wise
- Explore furniture from different shops
- Clean, image-first UI
- Customer explore page with filters (in progress)

---

## 🛠 Tech Stack

**Frontend**
- EJS (Server-side templates)
- HTML, CSS, JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer + Cloudinary (Image uploads)

---

## 📁 Project Structure

```text
design-dekhoo/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
│
├── views/
│   ├── dashboard/
│   ├── explore/
│   └── public-catalog.ejs
│
├── public/
│   ├── css/
│   └── js/
│
├── .gitignore
├── README.md
├── package.json
└── app.js
```

---

## ⚙️ Installation & Setup

Follow these steps to set up the DesignDekhoo project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/pranavpatildz/Design-Dekhoo-Site.git
cd Design-Dekhoo-Site
```

### 2. Install Dependencies
Install dependencies for both the main application and the backend:

```bash
# Install root/frontend dependencies
npm install
```

```bash
# Navigate to the backend directory and install its dependencies
cd backend
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory with the following content:

```env
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```
⚠️ `.env` files are ignored by Git for security reasons.

### 4. Run Instructions
Start both the backend server and the main application:

```bash
# Start the backend server (development mode with nodemon)
cd backend
npm start
```

```bash
# In a new terminal, start the main application
npm start
```

---

## Security Notes

-   **Environment Variables**: Sensitive information such as API keys and database credentials are managed using `.env` files and are excluded from version control via `.gitignore`.
-   **Authentication**: JSON Web Tokens (JWT) are employed for authenticating shop owners, securing dashboard access, and managing user sessions.

---

## Project Status

-   **Dashboard features**: In Progress 🚧
-   **Explore page**: In Progress 🔍

---

## Author

DesignDekhoo Project Team
