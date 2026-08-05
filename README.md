# FabricFlow AI - B2B Textile Marketplace

FabricFlow AI is a modern, AI-powered B2B textile marketplace designed to connect bulk textile buyers with verified suppliers across India. The platform streamlines fabric sourcing, enables comparison of supplier offers, provides AI-powered recommendations, and features order tracking and direct messaging.

---

## 🚀 Key Features

* **AI-Powered Search & Recommendations:** Find the exact fabrics, materials, and suppliers with intelligent text matching.
* **Dual Dashboards:** Custom experiences and dashboards for both **Buyers** and **Suppliers**.
* **Real-time Messaging:** Integrated chat drawer for negotiation and bulk quote inquiries.
* **Onboarding Flows:** User onboarding for buyers and suppliers to specify business categories, capabilities, and locations.
* **Cart & Order System:** Order management, tracking pipeline, and checkout flows optimized for bulk quantities.

---

## 🛠 Tech Stack

### Frontend (`/client`)
* **React 19** & **Vite 8**
* **Tailwind CSS v4**
* **Framer Motion** (for smooth UI animations)
* **React Router Dom v7** (routing)
* **Axios** (API integration)

### Backend (`/server`)
* **Node.js** & **Express**
* **MongoDB** (via Mongoose ODM)
* **JSON Web Token (JWT)** (auth security)
* **Bcrypt.js** (password hashing)
* **Multer** (file/image uploads)

---

## 📦 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammadimrose123/textile_marketplace.git
   cd textile_marketplace
   ```

2. **Run the Backend Server:**
   ```bash
   cd server
   npm install
   # Create a .env file (see Configuration below)
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

3. **Run the Frontend Client:**
   Open a new terminal and run:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The client will start on `http://localhost:5173`.

---

## ⚙️ Configuration

Create a `.env` file inside the `server/` directory and configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

For the frontend (`client/`), Vite loads variables prefixed with `VITE_`. If deploying to production, configure `VITE_API_URL` pointing to your deployed backend:
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🌐 Deployment

* **Backend:** Easily deployable to Node.js platforms like **Render**, **Railway**, or **Google Cloud Run**. Ensure you configure `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV=production` as environment variables.
* **Frontend:** Deployable to static hosting platforms like **Vercel** or **Netlify**. Set the build root directory to `client` and configure the environment variable `VITE_API_URL` pointing to your deployed server.
