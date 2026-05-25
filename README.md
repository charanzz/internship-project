# Full Stack Internship Project

## 🚀 Tech Stack
- **Frontend:** Angular 19 + Angular Material
- **Backend:** Node.js + Express + TypeScript  
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

## ✨ Features
- JWT Authentication (Login/Logout)
- Role-based access control (Admin / General User)
- Admin panel with user management
- Dashboard with async data loading
- Loading spinners demonstrating async behavior
- Toast notifications
- Responsive UI with Angular Material
- Protected routes with Angular Guards

## 🏗️ Architecture
- **Frontend:** Standalone Angular components, lazy-loaded modules, HTTP interceptors
- **Backend:** MVC pattern, middleware-based auth, RESTful APIs

## 🔧 Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend/app
npm install
ng serve
```

### Demo Credentials
- **Admin:** admin01 / admin123 / Admin role
- **User:** user01 / user123 / General User role

## 📁 Project Structure
```
internship-project/
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # JWT auth middleware
│   │   ├── models/       # MongoDB schemas
│   │   └── routes/       # API routes
└── frontend/
    └── app/
        └── src/app/
            ├── core/         # Services, guards, interceptors
            ├── models/       # TypeScript interfaces
            └── modules/      # Feature modules (auth, dashboard, admin)
```