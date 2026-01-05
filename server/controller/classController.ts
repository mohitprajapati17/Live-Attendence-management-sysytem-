import express from 'express';
import { Request, Response } from 'express';
import Class from '../schema.ts/Class';
import { getProfile } from './userController';
import mongoose from 'mongoose';

export const createClass = async (req: Request, res: Response) => {
    const profileResult = getProfile(req, res);
    const teacherId = (profileResult as any).user.userId;
    const className = req.body.className;
    const studentIds: mongoose.Types.ObjectId[] =[];

    try{
        const newClass = await Class.create({ teacherId, className, studentIds });
        return res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error creating class', error: error.message });
    }
    

};

