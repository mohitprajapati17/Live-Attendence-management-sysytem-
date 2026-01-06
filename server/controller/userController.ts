import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../schema.ts/user';
import jwt from 'jsonwebtoken';
import Class from '../schema.ts/class';
import mongoose from 'mongoose';

export const Signup = async (req: Request, res: Response) => {
    const {name,email,password,role}=req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });
    return res.status(201).json({ message: 'User registered successfully' });
};


export  const Signin=async(req: Request, res: Response) => {
    const { email, password } = req.body;
    const user=await User.findOne({ email });
    
    if (!user) {
        return res.status(401).json({ message: 'user not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token: string = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string);


    
    return res.status(200).json({ message: 'Signin successful', token });
}

export const getProfile = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if(!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return res.status(200).json({ message: 'Profile retrieved successfully', user: decoded });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

