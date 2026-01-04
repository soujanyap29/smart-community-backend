const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/amenities', require('./routes/amenityRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/gamification', require('./routes/gamificationRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

// Health check endpoints used for uptime checks
app.get('/', (req, res) => {
  res.json({ message: 'Smart Community Portal API Running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Bind to 0.0.0.0 so the API is reachable from other machines on the LAN
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
