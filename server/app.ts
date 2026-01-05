import express from 'express'
import { authorize } from 'middleware/authorize';
import userRoutes from './routes/userRoutes';
import user from 'schema.ts/user';
const app = express();




const PORT: number = 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

app.get("/auth", userRoutes);
app.get("/auth", userRoutes);

app.get("/auth",authorize(""))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
