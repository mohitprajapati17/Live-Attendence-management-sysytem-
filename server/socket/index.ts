import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import attendenceSchema from "../schema.ts/Attendence";
import { addAttendance, getActiveSession } from "../state/activeSession";
import Class from "../schema.ts/Class";
import Attendance from "../schema.ts/Attendance";


export const initWebSocket=(io: Server)=>{

    io.use((socket,next)=>{
        const token = socket.handshake.auth.token;
        if(!token){
            return next(new Error("Authentication error"));
        }
        try{
            const decoded=jwt.verify(token, process.env.JWT_SECRET!);
            console.log("Decoded", decoded);
            (socket as any).user = decoded;
        }catch(error){
            return next(new Error("Authentication error"));
        }
        next();
    });


    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on("Mark-Attendance", (data:{studentId:string}) => {
           if((socket as any).user?.role !== "student"){
            return;
           }
           if(!getActiveSession()){
            return;
           }

           const  {studentId}=data;
           addAttendance(studentId, getActiveSession()!.classId);
           io.emit("ATTENDANCE_MARKED", {studentId,status:"present"});

        });


        socket.on("GET_TODAY_SUMMARY",()=>{
            if((socket as any).user?.role !== "teacher"){
                return;
            }
            if (!getActiveSession()) {
                socket.emit('TODAY_SUMMARY', { presentCount: 0, presentStudentIds: [] });
                return;
            }
            const presentStudentIds = Object.keys(getActiveSession()!.attendance);
            const presentCount = presentStudentIds.length;
            socket.emit("TODAY_SUMMARY", { presentCount, presentStudentIds });
        })

        socket.on('CHECK_MY_STATUS',()=>{
            if((socket as any).user?.role !== "student"){
                return;
            }
            if(!getActiveSession()){
                socket.emit("MY_STATUS", { isPresent: null });
                return;
                
            }
            const status=getActiveSession()!.attendance[(socket as any).user?.id]?'present':null;
            socket.emit("MY_STATUS", { isPresent: status });
        })

        
            
        socket.on("DONE",async()=>{
             if((socket as any).user?.role !== "student"){
                return;
             }
             if(!getActiveSession()){
                return;
             }

             console.log('Ending session for class:', getActiveSession()!.classId);
             try{
                const {classId,attendance}=getActiveSession()!;
                const classDoc=await Class.findById(classId);
                if(!classDoc){
                    console.error('Class not found');
                    return;
                }

                const attendence=classDoc.studentIds.map((id)=>{
                    const Id=id.toString();
                    return {
                        classId,
                        studentId: Id,
                        status: attendance[Id] ? "present" : "absent",
                        date: new Date()
                    }
                })

                await Attendance.insertMany(attendence);
                const summ={
                    classId,
                    totalStudents:classDoc.studentIds.length,
                    presentStudents:attendence.filter(a=>a.status==='present').length,
                    absentStudents:attendence.filter(a=>a.status==='absent').length,
                    date:new Date()
                }
                io.emit("SESSION_ENDED",summ);
             }catch(error){
                console.error('Error ending session:', error);
             }
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
        
    });
}