import mongoose from "mongoose";
import 'dotenv/config';
import { ObjectId } from "mongodb";

const dbAddress = process.env.MONGO_CONN_STR;

//connect to server
mongoose.connect(
    dbAddress,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

//log that server connected successfully/unsuccessfully
db.on('error', (error) => {
    console.log(error);
});

db.once('open', () => {
    console.log('successfully connected to database');
});

const excerciseSchema = new mongoose.Schema({
    name : String,
    reps : Number,
    weight : Number,
    unit : String,
    date : String
});

const exercise = mongoose.model('excercise', excerciseSchema); 

const createExcercise = async (name, reps, weight, unit, date) => {
    const Excercise = new exercise({name, reps, weight, unit, date});
    return Excercise.save();
}

const findExcercise = async (filter) => {
    const query = exercise.find(filter);
    return query.exec();
}

const findExcerciseById = async (id) => {
    const query = exercise.findById(id);
    return query.exec();
}

const updateExcercise = async (filter, update) => {
    const result = await exercise.updateOne(filter, update);
    return result;
}

const deleteExcercise = async (filter) => {
    const result = await exercise.deleteOne(filter);
    console.log(result);
    if (result.deletedCount === 0) 
        return false;
    else 
        return true;
}
export {createExcercise, findExcercise, updateExcercise, deleteExcercise, findExcerciseById};