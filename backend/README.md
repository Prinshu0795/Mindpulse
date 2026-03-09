# MindPulse Backend

This is the backend server for the MindPulse application, built with Node.js, Express, and MongoDB.

## Features
- User Signup/Login with password hashing (Bcrypt).
- JWT (JSON Web Token) authentication.
- User Signup/Login with password hashing (Bcrypt).
- JWT (JSON Web Token) authentication.
- Protected routes middleware.
- Secure HTTP-only cookie support.

## Project Structure
```
backend/
 ├── config/        # Database configuration
 ├── controllers/   # Route controllers (logic)
 ├── middleware/    # Auth and other middleware
 ├── models/        # Mongoose schemas
 ├── routes/        # API endpoints
 ├── server.js      # Entry point
 └── .env.example   # Environment variables template
```

## API Documentation

### Auth Routes (`/api/auth`)
- **POST `/signup`**: Register a new user.
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
- **POST `/login`**: Authenticate user and get token.
  - Body: `{ "email": "...", "password": "..." }`

### User Routes (`/api/user`)
- **GET `/profile`**: Get current user profile (Protected).
  - Header: `Authorization: Bearer <token>`

## Database Schema (MongoDB)

### Users Collection
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Hashed, Required)
- `created_at`: Date (Default: now)

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file based on `.env.example`.
   - Update `MONGO_URI` with your MongoDB connection string (local or cloud).
   - Set a strong `JWT_SECRET`.

3. **Run the Server**:
   ```bash
   npm run dev
   ```

