# 🛒 Full-Stack E-Commerce Application

A feature-rich, full-stack E-Commerce platform built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js). The application provides robust user authentication, a dynamic shopping cart, seamless payment integration, and complete admin product/order management.

---

## 🔗 Live Deployments

* **Frontend App:** [https://e-commerce-clone-alpha.vercel.app](https://e-commerce-clone-alpha.vercel.app/)
* **Backend API:** [https://e-commerce-clone-backend.vercel.app](https://e-commerce-clone-backend.vercel.app/)

---

## 🚀 Key Features

* **User Authentication:** Secure registration and login using JWT stored in HTTP-only cookies and password hashing with Bcrypt.
* **Product Catalog:** Browse products by category, filter search results, and view detailed product pages.
* **Shopping Cart & Checkout:** Real-time cart state management, quantity toggles, and price recalculations.
* **Admin Dashboard:** Panel for managing products, uploading images, and monitoring user orders.
* **Responsive UI:** Fully responsive and styled with Tailwind CSS for modern mobile and desktop screens.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React.js
* **Styling:** Tailwind CSS, React Icons, Remixicon / Lucide Icons
* **State & UI Utilities:** Redix UI / Context API, React Toastify

### Backend
* **Runtime & Framework:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Authentication & Security:** JSON Web Token (JWT), Cookie-Parser, Bcrypt.js, CORS
* **Development:** Nodemon

---

## ⚙️ Environment Variables Setup

Create a `.env` file in your root backend directory and configure the following variables:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
TOKEN_SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=[https://e-commerce-clone-alpha.vercel.app](https://e-commerce-clone-alpha.vercel.app)
