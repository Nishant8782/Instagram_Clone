import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;  // Sender ID from logged-in user
        const recieverId = req.params.id;  // Receiver's ID from the URL
        const { message } = req.body;  // Message text from the request body

        // Check if a conversation already exists between the sender and receiver
        let conversation = await Conversation.findOne({
            participents: { $all: [senderId, recieverId] }
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participents: [senderId, recieverId],
                message: []  // Initialize the messages as an empty array
            });
        }

        // Create a new message
        const newMessage = await Message.create({
            senderId,
            recieverId,
            message  // Message content
        });

        // Push the new message's ObjectId to the conversation
        conversation.message.push(newMessage._id);

        // Save the conversation and message
        await Promise.all([conversation.save(), newMessage.save()]);

        //socket io

        const receiverSocketId = getReceiverSocketId(recieverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }


        // Get the sender and receiver details (including profile picture)
        const sender = await User.findById(senderId).select('profilePicture');
        const receiver = await User.findById(recieverId).select('profilePicture');

        // Respond with the success status and the new message along with profile details
        return res.status(201).json({
            success: true,
            newMessage,
            senderProfile: sender?.profilePicture, // Assuming profilePicture field
            receiverProfile: receiver?.profilePicture // Assuming profilePicture field
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};


export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;

        const conversation = await Conversation.findOne({
            participents: { $all: [senderId, recieverId] }
        }).populate('message');

        if (!conversation) return res.status(200).json({ success: true, message: [] });

        // Get the sender and receiver details (including profile pictures)
        const sender = await User.findById(senderId).select('profilePicture');
        const receiver = await User.findById(recieverId).select('profilePicture');

        return res.status(200).json({
            success: true,
            message: conversation?.message,
            senderProfile: sender?.profilePicture, // Assuming profilePicture field
            receiverProfile: receiver?.profilePicture // Assuming profilePicture field
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};