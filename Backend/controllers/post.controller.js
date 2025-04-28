import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import User from "../models/user.model.js";
import { Comment } from "../models/comments.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addPost = async (req, res) =>{
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;
        console.log(authorId)
        if(!image){
            return res.status(400).json({message : "Image required"})
           
        }
        //image ko optimize kiya
        const optimizedImage = await sharp(image.buffer)
        .resize({width:800, height:800, fit:'inside'})
        .toFormat('jpeg', {quality : 80})
        .toBuffer();

        //image ko buffer se data uri main 
        const fileUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        })

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path : "author", select : "-password"})
        return res.status(201).json({
            message : "New Post  Added",
            success : true,
            post
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
    
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path : 'author', select : 'username profilePicture'})
        .populate({path : 'comments',
            sort : {createdAt : -1},
            populate : {
                path : 'author',
                select : 'username profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success : true
        })
    } catch (error) {
        console.log(
            error
        );
        
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author : authorId }).sort({createdAt : -1})
        .populate({
            path : 'author',
            select : '+username profilePicture'
        }).populate({
            path : 'comments',
            sort : {cretaedAt : -1},
            populate : {
                path : 'author',
                select : '+username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success : true
        })

    } catch (error) {
        console.log(error);
        
    }
}

export const likePost = async (req, res) => {
    try {
        const likekarnewala = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) {
            return res.status(400).json({
                message : "post not found",
                success : true
            })
        }


        //like logic

        await post.updateOne({$addToSet:{likes:likekarnewala}});
        await post.save() 

        //socket Io

        // const user = await User.findById(likekarnewala).select('username profilePicture')
        // const postOwnerId = post.author.toString();

        // if(postOwnerId !== likekarnewala){
        //     //emit notification

        //     const notification = {
        //         type : "like",
        //         userId : likekarnewala,
        //         userDetail : user,
        //         postId, 
        //         message : "your post was liked"
        //     }

        //     const postOwnerSocketId = getReceiverSocketId(postOwnerId)
        //     io.to(postOwnerSocketId).emit('notification', notification)
        // }
        return res.status(200).json({message : "Post liked"})
    } catch (error) {
        console.log(error);
        
    }
}

export const dislikePost = async (req, res) => {
    try {
        const likekarnewala = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) {
            return res.status(400).json({
                message : "post not found",
                success : true
            })
        }

        //like logic

        await post.updateOne({$pull :{likes:likekarnewala}});
        await post.save() 

        //socket io bad main krenge

        // const user = await User.findById(likekarnewala).select('username profilePicture')
        // const postOwnerId = post.author.toString();

        // if(postOwnerId !== likekarnewala){
        //     //emit notification

        //     const notification = {
        //         type : 'dislike',
        //         userId : likekarnewala,
        //         userDetail : user,
        //         postId, 
        //         message : "your post was liked"
        //     }

        //     const postOwnerSocketId = getReceiverSocketId(postOwnerId)
        //     io.to(postOwnerSocketId).emit('notification', notification)
        // }

        return res.status(200).json({message : "Post Disliked"})
    } catch (error) {
        console.log(error);
        
    }
};

export const addComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentkarnewala = req.id;
        const { text } = req.body;

        const post = await Post.findById(postId);

        if (!text) {
            return res.status(400).json({ message: "text is required", success: false });
        }

        const newComment = await Comment.create({
            text,
            author: commentkarnewala,
            post: postId
        });

        const comment = await Comment.findById(newComment._id)
            .populate({
                path: 'author',
                select: 'username profilePicture'
            });

        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            message: "comment added",
            comment,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


export  const getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post : postId}).populate('author', 'username, profilePicture');

        if(!comments){
            return res.status(400).json({message : "No comments for this Posts"});
        }

        return res.status(200).json({
            success : true,
            comments
        })
    } catch (error) {
        console.log(error);
        
    }
}

export  const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                message : 'post not found ',
                success : false
            })
        }

        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }
        

        await Post.findByIdAndDelete(postId);


        //remove user id from userModel

        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();


        await Comment.deleteMany({post : postId});

        return res.status(200).json({
            sucess : true,
            message : "post deleted"
        })
    } catch (error) {
        console.log(error);
        
    }
}


export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(400).json({
                message : "post not found"
            })
        }

        const user = await User.findById(authorId);

        if(user.bookmarks.includes(post._id)){
            //remove from bookmark
            await user.updateOne({$pull : {bookmarks : post._id}});
            await user.save();

            return res.status(200).json({
                type : 'unsaved',
                message : "Post Unbookmarked",
                success: true
            })
        }else{
            //add to bookmark
            await user.updateOne({$addToSet : {bookmarks : post._id}});
            await user.save();

            return res.status(200).json({
                type : 'saved',
                message : "Post bookmarked",
                success: true
            })
        }
    } catch (error) {
        console.log(error);
        
    }
}