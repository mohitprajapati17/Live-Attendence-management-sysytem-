import { Router } from 'express';
import { getProfile, Signin, Signup } from '../controller/userController';

const router = Router();

router.get('/profile',getProfile);
router.get("/sign-in",Signin);
router.get("sign-up",Signup);


export default router;