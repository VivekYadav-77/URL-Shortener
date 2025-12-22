import jwt from "jsonwebtoken"
import crypto from "crypto"
export const generateTokenID =()=>{
     return crypto.randomUUID()
}
export const generateAccessToken=(userID)=>{
    return jwt.sign({
        id:userID
    },
    process.env.JWT_ACCESS_SECRET,
    {expiresIn:"30m"}
)
}
export const generateRefreshToken=(userID,tokenID)=>{
    return jwt.sign({
        id:userID,
        jti:tokenID
    },
    process.env.JWT_ACCESS_SECRET,
    {expiresIn:"7d"}
)
}