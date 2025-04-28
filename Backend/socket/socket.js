import express from 'express'
import { Server } from 'socket.io'
import  http from 'http'

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : 'http://localhost:5173',
        method:['GET', 'POST']
    }
})

//store the socketId according to the userId
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`user connected : userId = ${userId}, socketId = ${socket.id}`);
        
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        if(userId){
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})


export {app, server, io}