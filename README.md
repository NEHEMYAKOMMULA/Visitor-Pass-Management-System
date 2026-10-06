# Visitor Pass Management System

MERN Stack assessment project:
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt authentication
- Role-based access control
- Responsive CSS UI

## 1. Requirements
- Node.js 18+
- MongoDB 6+ locally OR MongoDB Atlas

## 2. Backend setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Linux/macOS:
```bash
cp .env.example .env
```

Backend runs on `http://localhost:5000`.

### Demo users

| Role | Email | Password |
|---|---|---|
| Administrator | admin@visitorpass.com | Admin@123 |
| Receptionist | receptionist@visitorpass.com | Reception@123 |
| Employee | employee@visitorpass.com | Employee@123 |

## 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 4. MongoDB

For local MongoDB:
```env
MONGO_URI=mongodb://127.0.0.1:27017/visitor_pass
```

For Atlas, replace `MONGO_URI` in `backend/.env`.

## 5. API overview

Auth:
- POST `/api/auth/login`
- GET `/api/auth/me`

Users:
- GET `/api/users`
- POST `/api/users`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

Visitors:
- GET `/api/visitors`
- POST `/api/visitors`
- GET `/api/visitors/:id`
- PUT `/api/visitors/:id/approve`
- PUT `/api/visitors/:id/reject`
- PUT `/api/visitors/:id/check-in`
- PUT `/api/visitors/:id/check-out`
- PUT `/api/visitors/:id/cancel`

Employees:
- GET `/api/employees`

Dashboard:
- GET `/api/dashboard`

Reports:
- GET `/api/reports?from=YYYY-MM-DD&to=YYYY-MM-DD`

Activity:
- GET `/api/activity`

## Business rules implemented

1. One active visit per visitor.
2. Duplicate same-day registrations are blocked.
3. Visit date cannot be in the past.
4. Today's arrival time cannot be in the past.
5. Maximum 3 pending requests per employee.
6. Check-in requires approval.
7. Already checked-in visitor cannot be checked in again.
8. Check-out must be later than check-in.
9. Rejected requests cannot be checked in.
10. Cancelled visits are excluded from active lists.

## Production notes

For deployment:
- Backend: Render/Railway/other Node host
- MongoDB: MongoDB Atlas
- Frontend: Vercel/Netlify
- Set `VITE_API_URL` to the deployed backend API URL.
- Change JWT secret and demo passwords before production use.
