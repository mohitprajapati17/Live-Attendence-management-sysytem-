import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

export  const authorize=(role: string,req: Request,res: Response,next: Function) => {
    let token =req.headers.authorization;
    if(!token||!token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    token =token.split("  ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Decoded token:", decoded);

        (req as any).user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
   next();
};

export  const restricTo = (role: string) => {
    return (req: Request, res: Response, next: Function) => {
        const user = (req as any).user;
        if(user && user.role === role) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
        }
    };
};
    