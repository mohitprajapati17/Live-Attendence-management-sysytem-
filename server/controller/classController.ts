import express from 'express';
import { Request, Response } from 'express';
import Class from '../schema.ts/Class';
import { getProfile } from './userController';
import mongoose from 'mongoose';
import User from '../schema.ts/user';
import Attendence from 'schema.ts/Attendence';

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



