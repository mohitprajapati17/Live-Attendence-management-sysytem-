import { Router } from 'express';
import { getProfile, Signin, Signup } from '../controller/userController';

const router = Router();

router.get('/', getProfile);
router.post("/sign-in", Signin);
router.post("/sign-up", Signup);



export default router;