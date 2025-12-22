import jwt from 'jsonwebtoken'
import UserCollection from '../models/user_model.js'
import RefreshTokenCollection from '../models/statefull_model.js'
import { generateAccessToken,generateRefreshToken,generateTokenID } from '../utils/tokens.js'
//Register
export const register = async (req,res)=>{
    const {name,email,password}=req.body
    if(!name||!email||!password){
        return res.status(400).json({message:"All fields required"})
    }
    const existingUser = await UserCollection.findOne({$or:[{ email }, { username }]})
    if(existingUser){
        return res.status(409).json({message:"User already exist"})
    }
    await UserCollection.create({name,email,password})
    res.status(201).json({message:"User registered successfully"})
}
//Login
export const login =async (req,res)=>{
    const {email,password} = req.body
    const user = await UserCollection.findOne({email}).select("+password")
    if(!user||!(await user.comparePassword(password))){
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(user._id);
    const tokenId = generateTokenID();
    const refreshToken = generateRefreshToken(user._id, tokenId);
    await RefreshTokenCollection.create({
        tokenId,
        user:user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })
    res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful" });
};
//Refresh
export const refresh = (req,res)=>{
    const token = req.cookies.refreshToken
    if(!token){
        return res.status(401).json({ message: "No refresh token" });
    }
}

