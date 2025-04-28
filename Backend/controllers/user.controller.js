import mongoose from 'mongoose'
import User from '../models/user.model.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';

export const register = async (req, res) =>{
    try {
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(404).json({
                message : "you are mising somthing",
                success:false
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message : "use another email",
                sucess : false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password:hashedPassword
        })
        return res.status(201).json({
            message : "Account created successfully",
            sucess : true
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(404).json({
                message: "You are missing something",
                success: false
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Email or Password is invalid",
                success: false
            });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(404).json({
                message: "Email or Password is invalid",
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Populate posts
        const populatePost = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post && post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        );

        const filteredPosts = populatePost.filter(post => post !== null);

        // Customize the user object
        user = {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            email: user.email,
            gender: user.gender,
            post: filteredPosts
        };

        // Send cookie and response
        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
            })
            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", {maxAge:0}).json({
            message : "logout successfully",
            sucess : true
        })
    } catch (error) {
        console.log();
        
    }
}

export const getProfile = async(req, res) => {
    try {
        const userId = req.params.id;

        let user = await User.findById(userId).populate({
            path : "posts",
            select : "image likes comments"
        })

        return res.status(200).json({
            user,
            success : true
        })
    } catch (error) {
        console.log(error);
        
    }
}


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;

        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message : "user not found",
                success : false
            })
        }
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        return res.status(201).json({
            message : "profile pitcure update successfully",
            success : true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
    })
}
}

export const getSuggestedUser = async (req, res) => {
    try {
        const SuggestedUser = await User.find({_id:{$ne : req.id}}).select("-password");
        if(!SuggestedUser){
            return res.status(400).json({
                messsage : "Dont have suggested user",

            })
        }
        return res.status(200).json({
            success : true,
            users : SuggestedUser
        })
    } catch (error) {
        console.log(error);
        
    }
    
}

export const followOrUnfollow = async (req, res) => {
    try {
        const followKarnreWala = req.id //login device
        const jiskoFollowKarunga = req.params.id;

        if(followKarnreWala === jiskoFollowKarunga){
            return res.status(400).json({
                message : "you can not follow yourSelf",
                success : false
            })
        }
        const user = await User.findById(followKarnreWala);
        const targetUser = await User.findById(jiskoFollowKarunga);
        if (!user || !targetUser) {
            return res.status(400).json({
                messsage : "user not found",
                success : false
            })
        }

        const isFollowing = user.following.includes(jiskoFollowKarunga);
        if (isFollowing) {
            //unfollow logic
            await Promise.all([
                User.updateOne({_id:followKarnreWala}, {$pull : {following: jiskoFollowKarunga}}),
                User.updateOne({_id:jiskoFollowKarunga}, {$pull : {followers: followKarnreWala}}),
            ])
            return res.status(200).json({
                message : "unfollow successfully",
                success : true
            })
            
        }else {
            //follow logic
            await Promise.all([
                User.updateOne({_id:followKarnreWala}, {$push : {following: jiskoFollowKarunga}}),
                User.updateOne({_id:jiskoFollowKarunga}, {$push : {followers: followKarnreWala}}),
            ])
            return res.status(200).json({
                message : "follow successfully",
                success : true
            })
        }
    } catch (error) {
        console.log(error);
        
    }
}