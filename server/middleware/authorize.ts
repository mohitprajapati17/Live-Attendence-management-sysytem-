import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

interface RequestAuth extends Request {
    user?: any;
}

export const authorize = (req: RequestAuth, res: Response, next: Function) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    token = token.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: 'Invalid token.', error: error });
    }
};

export const restricTo = (roles: string[]) => {
    return (req: RequestAuth, res: Response, next: Function) => {
        const user = req.user;
        if (user && roles.includes(user.role)) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
        }
    };
};
