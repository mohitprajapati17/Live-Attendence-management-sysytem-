import mongoose from "mongoose";
const Schema = mongoose.Schema;

const classSchema = new Schema({
    className:{
        type:String , 
        required:true,
    },
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Teacher',
        required:true
    },
    studentIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }]
   
});

export default mongoose.model('Class', classSchema);