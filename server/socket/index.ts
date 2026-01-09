import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import attendenceSchema from "../schema.ts/Attendence";
import { addAttendance, getActiveSession } from "../state/activeSession";

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

        socket.on("Mark -Attendance", (data:{studentId:string}) => {
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

        
            
            socket.on("stop-class", (classId:string) => {
                console.log("Stop class", classId);
            });
      
            console.log("Student connected", (io as any).user);
            socket.on("ATTENDANCE_MARKED",async (data:{id:string, classId:string}) => {
                console.log("Mark present", data);
                const attendence = await attendenceSchema.create({
                    studentId: data.id,
                    classId: data.classId,
                    date: new Date(),
                    status: "present",
                    createdAt: new Date(),
                });
                addAttendance(data.id, data.classId);
                console.log("Attendence", attendence);
            });
        
    });
}