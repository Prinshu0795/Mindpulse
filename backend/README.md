# MindPulse Backend

This is the backend server for the MindPulse application, built with Node.js, Express, and MongoDB.

## Features
- User Signup/Login with password hashing (Bcrypt).
- JWT (JSON Web Token) authentication.
- Google OAuth 2.0 integration.
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
- **POST `/google`**: Authenticate via Google.
  - Body: `{ "name": "...", "email": "...", "google_id": "..." }`

### User Routes (`/api/user`)
- **GET `/profile`**: Get current user profile (Protected).
  - Header: `Authorization: Bearer <token>`

## Database Schema (MongoDB)

### Users Collection
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Hashed, required if not Google auth)
- `google_id`: String (Optional)
- `created_at`: Date (Default: now)

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   - Rename `.env.example` to `.env`.
   - Update `MONGO_URI` with your MongoDB connection string.
   - Set a strong `JWT_SECRET`.

3. **Run the Server**:
   ```bash
   npm run dev
   ```

## Google OAuth 2.0 Setup

To enable Google Login:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Navigate to "APIs & Services" > "Credentials".
4. Click "Create Credentials" > "OAuth client ID".
5. Set the application type to "Web application".
6. Add `http://localhost:5173` to "Authorized JavaScript origins".
7. Add `http://localhost:5000/api/auth/google/callback` to "Authorized redirect URIs" (if using passport-google-oauth20 strategy directly).
8. Copy the `Client ID` and `Client Secret`.
9. Add them to your backend `.env` file.
