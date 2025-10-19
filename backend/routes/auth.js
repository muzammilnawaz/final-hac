import express from 'express';
import User from '../model/user_model.js'; 
import bcrypt from 'bcryptjs';
import { protect } from '../middleware/middleware.js';
import 'dotenv/config'
import jwt from 'jsonwebtoken';
const router = express.Router();
const secret = process.env.JWT_SECRET; 

router.post('/signup', async (req, res, next) => {
 let { fullName, email, password } = req.body;

 if (!fullName || !email || !password) {
  return res.status(400).send({ message: "Full name, email, and password are required" })
 }

 email = email.toLowerCase()
 try {
  let exisEmail = await User.findOne({ email })
  if (exisEmail) {
   return res.status(400).send({ message: "User already exists with this email" })
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  let userCreated = await User.create({
   fullName,
   email,
   password: hash,
  })
  
  const { password: _p, ...user } = userCreated._doc
  res.status(201).send({ message: "User Created. You can now login.", user })
 } catch (error) {
  next(error); 
 }
})

// --- LOGIN (Simple) ---
router.post('/login', async (req, res, next) => {
 let { email, password } = req.body;

 if (!email || !password) {
  return res.status(400).send({ message: "Email and password are required" })
 }
 email = email.toLowerCase();
 try {
  let user = await User.findOne({ email });
  if (!user) {
   res.status(404).json({ message: "User not found with this email" })
   return
  }
  
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
   res.status(401).send({ message: "Invalid email or password" })
  return;
  }

  let token = jwt.sign({
   user_id: user._id, 
   fullName: user.fullName,
   email: user.email,
  }, secret, { expiresIn: "1d" });

  res.cookie("token", token, {
   httpOnly: true,
   sameSite: "none",
   secure: true,
   maxAge: 24 * 60 * 60 * 1000
  })
    
  const { password: _p, isVerified: _v, ...saveUser } = user._doc
  res.status(200).send({ message: "User login successful", user: saveUser, token })
 } catch (error) {
  next(error); 
 }
})

router.post('/logout', (req, res) => {
 res.cookie("token", "", {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  expires: new Date(0) 
  });
 res.status(200).send({ message: "Logged out successfully" });
});



router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    expires: new Date(0)
  });
  res.status(200).send({ message: "Logged out successfully" });
});

export default router;