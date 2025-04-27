import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type:String, required:true, minlength:3, maxlength:50, unique:true},
    email : {type:String, minlength:8, unique:true},
    password : {type:String, required:true, minlength:4, maxlength:100},
    gender : {type:String, required:false, enum:["male", "female"]},
},
{
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);
export default userModel;