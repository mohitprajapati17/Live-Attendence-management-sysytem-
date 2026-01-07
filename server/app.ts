import express from 'express'
import { authorize } from 'middleware/authorize';
import userRoutes from './routes/userRoutes';
import user from 'schema.ts/user';
import { restricTo } from 'middleware/authorize';
import { classRouter } from './routes/classRoutes';
const app = express();




const PORT: number = 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

app.use("/auth", userRoutes);

app.use("/auth/profile",authorize,restricTo(["teacher","student"]),userRoutes);

app.use("/",authorize,restricTo(["teacher"]),classRouter);
app.use("class/:id",authorize,restricTo(["teacher","student"]),classRouter);
app.use("/class/:id/my-attendence",authorize,restricTo(["student"]),classRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


