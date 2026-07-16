const path = require('path');
const dotenv = require('dotenv');

// Load env vars from current directory or backend directory explicitly
const envPath = path.join(__dirname, '.env');
console.log(`[ENV] Loading .env from: ${envPath}`);
console.log(`[ENV] Current Working Directory: ${process.cwd()}`);
dotenv.config({ path: envPath });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route files
const auth = require('./routes/authRoutes');
const user = require('./routes/userRoutes');
const assessments = require('./routes/assessmentRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://mindpulse-steel.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isVercel = origin.endsWith('.vercel.app');
        if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:') || isVercel) {
            return callback(null, true);
        }
        callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    },
    credentials: true
}));

// Health check and Mount routers
app.get('/', (req, res) => res.send('MindPulse API is running...'));
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/assessments', assessments);

const PORT = process.env.PORT || 5000;

// Connect to database then start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (err) {
        console.error('Server failed to start:', err.message);
    }
};

startServer();
