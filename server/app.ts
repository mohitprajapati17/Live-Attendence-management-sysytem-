import express from 'express'
import { authorize } from 'middleware/authorize';
import userRoutes from './routes/userRoutes';
import user from 'schema.ts/user';
import { restricTo } from 'middleware/authorize';
import { classRouter } from './routes/classRoutes';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

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
        (io as any).user = decoded;
    });
}

app.use("/auth", userRoutes);

app.use("/auth/profile",authorize,restricTo(["teacher","student"]),userRoutes);

app.use("/",authorize,restricTo(["teacher"]),classRouter);
app.use("class/:id",authorize,restricTo(["teacher","student"]),classRouter);
app.use("/class/:id/my-attendence",authorize,restricTo(["student"]),classRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


