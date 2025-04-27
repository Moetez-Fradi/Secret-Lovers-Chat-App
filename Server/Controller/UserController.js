import userModel from "../Models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToke = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"})
}

export const registerUser = async (req, res) => {
    try {
    const {username, email, password, gender} = req.body;
    let user = await userModel.findOne({username});
    
    if (user) return res.status(400).json("already exists");

    if (!username || !password || !email){
        return res.status(400).json("required fields missing!")
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json("invalid email");
    }

    // if (!validator.isStrongPassword(password)) {
    //     return res.status(400).json("weak password");
    // }

    user = new userModel({username, email, password, gender});
    // now to hash the password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToke(user._id);

    return res.status(200).json({_id: user._id, username, email, token});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const loginUser = async(req, res) => {
    const {username, password} = req.body;

    try {
        let user = await userModel.findOne({username});

        if (!user) {
            return res.status(400).json("user not found!")
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword){
            return res.status(400).json("invalid password");
        };
        const token = createToke(user._id);
        return res.status(200).json({ _id:user._id, username:username, email:user.email, token, message:"you're logged!"});

    } catch (error) {
        res.status(500);
    }
};

export const fetchUser = async (req, res) => {
    try {
        let fetching = req.params.username;
        let user = await userModel.findOne({_id:fetching}); 
        if (!user) {
            return res.status(404).json("no user registered with that username.");
        }
        return res.status(200).json(user);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json("internal server error");
    }
};

export const fetchAllUsers = async (req, res) => {
    try {
        let users = await userModel.find();
        if (!users.length) {
            return res.status(404).json("no users registered currently.");
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json("server erreur bro");
    }
}