'use strict';

import 'dotenv/config';
import express, { query } from 'express';
import asyncHandler from 'express-async-handler';
import * as database from './model.mjs';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get('/exercises', asyncHandler(async (req, res) => {
    console.log("get excercise");
    const excerciseArr = await database.findExcercise({});
    res.set({
        'status' : '200',
        'Content-Type' : 'application/json'
    });
    res.send(excerciseArr);
}));

app.get('/exercises:id', asyncHandler(async (req, res) => {
    console.log("get excercise by id");
    let { id } = req.params;
    id = id.slice(1, id.length); //remove colon
    const excerciseArr = await database.findExcercise({_id : id});
    res.set({
        'status' : '200',
        'Content-Type' : 'application/json'
    });
    res.send(excerciseArr);
}));

app.post('/exercises', asyncHandler(async (req, res) => {
    console.log("create excercise");
    const excerciseObj = await database.createExcercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date);
    res.set({
        'status' : '201', 
        'Content-Type' : 'application/json'
    });
    res.send(excerciseObj);
}));

app.put('/exercises:id', asyncHandler(async (req, res) => {
    console.log('update exercise by id');
    let { id } = req.params;
    id = id.slice(1, id.length); //remove colon
    const update = {
        'name' : req.body.name,
        'reps' : req.body.reps,
        'weight' : req.body.weight,
        'unit' : req.body.unit,
        'date' : req.body.date
    }
    await database.updateExcercise({_id : id}, update);
    const updatedObj = await database.findExcercise({_id : id});
    res.set({
        'status' : '201', 
        'Content-Type' : 'application/json'
    });
    res.send(updatedObj);
}));

app.delete('/exercises:id', asyncHandler(async (req, res) => {
    console.log('delete exercise by id');
    let { id } = req.params;
    id = id.slice(1, id.length); //remove colon
    const deleted = await database.deleteExcercise({_id : id}); 
    res.set({
        'status' : '204'
    }); //prints true if there was an object to delete, false if there was no object to delete
    res.send(`exercise was deleted successfully: ${deleted}`);
}));

app.listen(PORT, () => {
    console.log(`express server listening on port ${PORT}`);
});