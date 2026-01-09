import mongoose from 'mongoose';


const attendenceSchema = new mongoose.Schema({
    classId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    status:{
        type:String,
        default: 'absent',
        enum: ['present', 'absent']
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Attendence', attendenceSchema);
