import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
    },
    password:{  // hashed password will be stored
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum: ['student', 'teacher'],
        default: 'student',
    },
});




export default mongoose.model('User', userSchema);
