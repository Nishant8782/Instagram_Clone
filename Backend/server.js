import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connect from './utils/db.js';
import userRoutes from './routes/user.route.js'
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js'
import { app, server } from './socket/socket.js';
import path from 'path';


dotenv.config();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
console.log(__dirname);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true   
}));
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// If needed, only use this to handle fallback route for SPA (Single Page Application)
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, (req, res) => {
    connect();
    console.log(`server is Running on the Port : ${PORT}`);
});
