const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const {checkDatabaseConnection} = require('./src/config/database');
const app = express();

const PORT = process.env.PORT || 8000;
const authroutes=require('./src/routes/auth.routes');
const ticketroutes= require('./src/routes/ticket.routes');
const dashroutes= require('./src/routes/dashboard.routes')
// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true
  })
);

// Parse JSON
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth',authroutes);
app.use('/api/tickets',ticketroutes);
app.use('/api/dashboard',dashroutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serviqo API is running',
    timestamp: new Date().toISOString()
  });
});



// check db connection &  server connection
const startServer=async () => {
  try {
    await checkDatabaseConnection();  

    app.listen(PORT, () => {
      console.log(`Serviqo API running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1); // Exit the process with an error code
  }
}
startServer();

