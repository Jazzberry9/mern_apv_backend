import  jwt  from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

export const verifyToken = async ( req, res, next ) => {

    const token = req.body.token || req.query.token || req.headers.authorization;

    if(!token){
        res.status(403).json({
            msg: "A token is required for authentication"
        })
    }
    
    try {
        const decoded = jwt.verify(token.split('Bearer ')[1], process.env.JWT_SECRET)
        const user = await Veterinario.findById(decoded.payload).select('-password -token -confirmed')
        req.vet = user;
    } catch (error) {
        console.log(error);
        res.status(403).json({
            msg: 'Invalid token'
        })
    }

    next();
}