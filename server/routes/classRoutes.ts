import express from 'express';
import { createClass , addStudent, getClass, getStudent, myAttendenceByClassId, attendenceStart} from '../controller/classController';

const router = express.Router();

router.post("class/", createClass);
router.post("class/:id/add-student", addStudent);
router.get("class/:id", getClass);
router.get("class/students", getStudent);
router.get("class/:id/my-attendence",myAttendenceByClassId)
router.post("/attendence/start",attendenceStart)





