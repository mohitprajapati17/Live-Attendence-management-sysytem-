import express from 'express';
import { createClass , addStudent, getClass, getStudent, myAttendenceByClassId, attendenceStart} from '../controller/classController';

const router = express.Router();

router.post("class/", createClass);
router.post("class/:id/add-student", addStudent);
router.get("/", getClass);
router.get("class/students", getStudent);
router.get("/",myAttendenceByClassId);
router.post("/attendence/start",attendenceStart)

export const classRouter=router;



