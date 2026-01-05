import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

export  const authorize=(role: string,req: Request,res: Response,next: Function) => {
    let token =req.headers.authorization;
    if(!token||!token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    if(role!=='teacher'&& role!=='student') {
        return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }
    token =token.split("  ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Decoded token:", decoded);
        
        // Check if the user has the required role
        if (decoded.role !== role) {
            return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: 'Invalid token.' });
    }






   
   next();
};