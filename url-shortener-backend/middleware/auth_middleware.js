import jwt from "jsonwebtoken"
const authMiddleware = (req,res,next)=>{
    const token = req.cookies.accessToken
    if(!token){
        return res.status(401).json({ code: "NO_ACCESS_TOKEN" });
    }
    try {
        const decoded =jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        req.userId = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({ code: "ACCESS_TOKEN_EXPIRED" });
    }
}
export default authMiddleware