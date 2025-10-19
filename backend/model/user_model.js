import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: Number },
    otpExpiry: { type: Date },
    roleBase: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;