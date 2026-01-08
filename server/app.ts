import express from 'express'
import { authorize } from 'middleware/authorize';
import userRoutes from './routes/userRoutes';
import user from 'schema.ts/user';
import { restricTo } from 'middleware/authorize';
import { classRouter } from './routes/classRoutes';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import attendenceSchema from './schema.ts/Attendence';
import { addAttendance } from './state/activeSession';


const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT: number = 3000;

export const initWebSocket=()=>{
    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        const  token = socket.handshake.auth.token;
        console.log("Token", token);

        if(!token){
            socket.disconnect();
            return;
        }

        const decoded=jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Decoded", decoded);
        (socket as any).user = decoded;
        if((socket as any).user.role === "teacher"){
            socket.on("start-class", (classId:string) => {
                console.log("Start class", classId);
                socket.broadcast.emit("start-class", classId);
            });
            socket.on("stop-class", (classId:string) => {
                console.log("Stop class", classId);
            });
        }else{
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
        }
    });
}

initWebSocket();
app.use("/auth", userRoutes);

app.use("/auth/profile",authorize,restricTo(["teacher","student"]),userRoutes);

app.use("/",authorize,restricTo(["teacher"]),classRouter);
app.use("class/:id",authorize,restricTo(["teacher","student"]),classRouter);
app.use("/class/:id/my-attendence",authorize,restricTo(["student"]),classRouter);


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


