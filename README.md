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



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/pranavpatildz/Design-Dekhoo-Site.git
cd Design-Dekhoo-Site

### 2️⃣ Install dependencies

Install frontend dependencies:
```bash
npm install

Install backend dependencies:
cd backend
npm install

### 3️⃣ Environment Variables

Create a .env file in the root and backend folder and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

⚠️ .env files are ignored by Git for security reasons.

###4️⃣ Run the project

Start the application:
npm start


For development mode:
nodemon app.js

👨‍💻 Author

Pranav Patil
GitHub: https://github.com/pranavpatildz