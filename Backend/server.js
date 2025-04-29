import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';


import connect from './utils/db.js';
import userRoutes from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app, server } from './socket/socket.js';

// Setup __dirname manually
const __dirname = path.resolve();
console.log(__dirname);

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // <-- fix path

// SPA fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));  // <-- fix path
});



// Start server
server.listen(PORT, () => {
  connect();
  console.log(`Server is running on port: ${PORT}`);
});
