import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const bearerHeaders = req.headers.authorization;
        if(!bearerHeaders){
            throw {message: "se necesita token con formato bearer"};
        }
        const token = bearerHeaders.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_PASS); 

        req.correo = payload.correo;

        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:error.message}); 
    }
};