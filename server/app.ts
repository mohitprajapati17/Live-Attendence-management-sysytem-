import express from 'express'
import { authorize } from 'middleware/authorize';
import userRoutes from './routes/userRoutes';
import user from 'schema/user';
import { restricTo } from 'middleware/authorize';
import { classRouter } from './routes/classRoutes';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import { initWebSocket } from './socket';

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT: number = 3000;



initWebSocket(io);

app.use("/auth", userRoutes);
app.use("/auth/profile", authorize, restricTo(["teacher", "student"]), userRoutes);

app.use("/", authorize, restricTo(["teacher"]), classRouter);
app.use("class/:id", authorize, restricTo(["teacher", "student"]), classRouter);
app.use("/class/:id/my-attendence", authorize, restricTo(["student"]), classRouter);


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


