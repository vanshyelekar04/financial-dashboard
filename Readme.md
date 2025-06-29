# 💰 Financial Analytics Dashboard

A full-stack financial application that allows users to **analyze**, **search**, **filter**, and **export** company transactions in real time with advanced data visualizations and secure authentication.

> 🔒 Built with TypeScript, React, Node.js, MongoDB, JWT Auth, Recharts, Material UI & Zustand.

---

## 📧 Author
**Vansh Yelekar**  
📩 Email: [vanshyelekar04@gmail.com](mailto:vanshyelekar04@gmail.com)

---

## 🎯 Project Objective

Enable financial analysts to:
- View key financial metrics at a glance
- Search, filter, and sort transactions
- Analyze trends with visualizations
- Export reports as CSV with selected columns

---

## 🧠 Key Features

### ✅ Authentication
- Secure login with **JWT tokens**
- Route protection on frontend and backend

### 📊 Dashboard & Analytics
- Stat cards: **Balance, Revenue, Expenses, Savings**
- Charts: **Line (Trends)** & **Pie (Category breakdowns)**

### 📁 Transactions
- Paginated, responsive table
- Click-to-edit functionality
- Real-time search, filter, sort
- User avatars for better UX

### 📤 CSV Export
- Choose which columns to export
- Auto-download via browser

---
---
## POSTMAN COLLECTION LINK:

https://web.postman.co/workspace/ad6d27c1-ea43-4047-9a59-270b70f7f924

---
---

## ⚙️ Tech Stack

| Area        | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React + TypeScript                |
| State Mgmt  | Zustand                           |
| UI Library  | Material-UI (MUI v5)              |
| Charts      | Recharts                          |
| Backend     | Node.js + Express + TypeScript    |
| Database    | MongoDB (Mongoose ORM)            |
| Auth        | JWT + Middleware Validation       |
| CSV Export  | `json2csv`                        |
| Dev Tools   | TS-Node, dotenv, nodemon, rate-limit, helmet |

---

## 🗂️ Folder Structure

```
financial-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── index.ts
│   ├── data/
│   │   └── transactions.json
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   ├── contexts/
    │   ├── store/
    │   ├── theme/
    │   └── App.tsx, main.tsx
    └── package.json
```

---

## 🛠️ Setup Instructions (Noob-Friendly)

### 🔧 Prerequisites

- Node.js (v18+)
- MongoDB Atlas account *(free cluster)*
- Yarn or NPM installed
- Git installed

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/vanshyelekar04/financial-dashboard.git
cd financial-dashboard
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

#### 📄 Create `.env` file in `backend/`

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

> Replace `your-mongodb-uri` with MongoDB connection string  
> Example: `mongodb+srv://username:password@cluster.mongodb.net/mydb`

#### ✅ Start Backend (with Auto Import)

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
✅ Auto-imported 250 transactions.
🚀 Server running on port 5000
```

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

#### 🔧 Create `.env` in `frontend/` *(optional)*

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

#### ▶️ Run Frontend

```bash
npm run dev
```

> Visit [http://localhost:3000](http://localhost:3000)

---

## 🔐 Login Credentials

```
Email:    admin@loopr.ai
Password: admin123
```

> These are hardcoded in `backend/src/controllers/auth.controller.ts`

---

## 📦 CSV Export

- Go to Dashboard
- Click `Export CSV`
- Select the columns
- Click `Download`

Your file will be automatically downloaded.

---

## 🧪 Test Data

The `backend/data/transactions.json` contains dummy data:

```json
[
  {
    "id": "1",
    "date": "2025-01-01",
    "amount": 1200,
    "category": "Salary",
    "status": "paid",
    "user_id": "vansh",
    "user_profile": "https://example.com/image.png"
  }
]
```

---

## 🧼 Lint & Format

```bash
npx prettier --write .
```

---

## 💡 Future Improvements

- Role-based access (Admin/User)
- PDF export
- Mobile responsiveness
- Data upload from CSV

---

## 🙋 FAQ

**Q: Getting CORS errors?**  
A: Make sure backend is running on port `5000` and frontend on `3000`. CORS is enabled for localhost.

**Q: How to reset database?**  
A: Run `npm run import` inside the backend directory.

**Q: How to deploy?**  
- **Frontend**: Vercel  
- **Backend**: Render or Railway + MongoDB Atlas

---

## 📃 License

MIT © Vansh Yelekar – [vanshyelekar04@gmail.com](mailto:vanshyelekar04@gmail.com)
