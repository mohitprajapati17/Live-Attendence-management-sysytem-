import express from 'express';
import { Request, Response } from 'express';
import Class from '../schema.ts/class';
import { getProfile } from './userController';
import mongoose from 'mongoose';
import User from '../schema.ts/user';
import Attendence from '../schema.ts/Attendence';
import jwt from 'jsonwebtoken';
import { activeSession } from '../state/activeSession';

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

export const addStudent = async (req: Request, res: Response , StudentId: string) => {
    const classId = req.params.classId;
    const classDoc = await Class.findById(classId);
    const teacherId = classDoc?.teacherId;

    const profileResult = getProfile(req, res);
    const userId = (profileResult as any).user.userId;

    if(teacherId!==userId){
        return res.status(403).json({ message: 'Unauthorized: Only the teacher can add students' });
    }
    try{
        const newClass=await Class.findByIdAndUpdate(classId, { $push: { studentIds: StudentId } }, { new: true });
        return res.status(200).json({ message: 'Student added successfully', class: newClass });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error adding student', error: error.message });
    }
    
}

export const getClass=async(req:Request,res:Response, id:string)=>{
    try {
        const classDoc = await Class.findById(id).populate('studentIds');
        if(!classDoc){
            return res.status(404).json({ message: 'Class not found' });
        }
        return res.status(200).json({ 
            _id: classDoc._id,
            teacherId: classDoc.teacherId,
            className: classDoc.className,
            studentIds: classDoc.studentIds
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching class', error: error.message });
    }
}

export const getStudent=async(req: Request, res: Response)=>{
    try{
        const data=await User.find({ role: 'student' });
        return res.status(200).json({ students: data });


    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
    



}

export const myAttendenceByClassId=async(req:Request,res:Response,classId:string,studentId:mongoose.Types.ObjectId)=>{
    const classData=await Class.findById(classId);
    if(!classData){
        return res.status(404).json({ message: 'Class not found' });
    }

    if(!classData.studentIds.includes(studentId)){
        return res.status(404).json({ message: 'Student not found in class' });
    }

    try{
        const attendence=await Attendence.find({classId, studentId})
        return res.status(200).json({ message: 'Attendence retrieved successfully', attendence });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching attendence', error: error.message });
    }
    
}


export const attendenceStart = async (req: Request, res: Response) => {
    try {
        const classId = req.body.classId;
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            // Verify the token and get the user data
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string }; // Add proper type for the decoded token
            
            // Now you can use decoded._id as the userId
            const userId = decoded._id;
            if(userId!==classData.teacherId.toString()){
                return res.status(403).json({ message: 'You are not authorized to start attendance for this class' });
            }

            activeSession.classId = classId;
            activeSession.startedAt = new Date();
            activeSession.attendence = {};

            // Rest of your code..
            // save activeSession to database
            return res.status(200).json({ message: 'Attendance started successfully',activeSession });
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Error in attendenceStart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



