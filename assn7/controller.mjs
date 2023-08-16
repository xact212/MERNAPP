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

app.get('/exercises/:_id', asyncHandler(async (req, res) => {
    console.log("get excercise by id");
    let id = req.params._id;
    const excerciseArr = await database.findExcercise({_id : id});
    if (excerciseArr === 'undefined') {
        res.set({
            'status' : '404',
            'Content-Type' : 'application/json'
        });
        res.send({Error : "Item not found"});
    }
    res.set({
        'status' : '200',
        'Content-Type' : 'application/json'
    });
    res.send(excerciseArr);
}));

app.post('/exercises', asyncHandler(async (req, res) => {
    console.log("create excercise");
    const nameIsValid = (req.body.name !== 'undefined' && req.body.name !== null && req.body.name !== '');
    const repsIsValid = (req.body.reps !== 'undefined' && req.body.reps > 0);  
    const weightIsValid = (req.body.weight !== 'undefined' && req.body.weight > 0);  
    const unitIsValid = (req.body.unit === 'kgs' || req.body.unit === 'lbs');
    const dateIsValid = () => {
        if (req.body.date === 'undefined' || req.body.date === null || req.body.date === '' || req.body.date.length !== 8)
            return false;
        else {
            if (req.body.date[2] !== '-' || req.body.date[5] !== '-')
                return false;
            const month = req.body.date.slice(0, 2);
            if (parseInt(month) === NaN || parseInt(month) > 12 || parseInt(month) < 1)
                return false;
            const day = req.body.date.slice(3, 5);
            if (parseInt(day) === NaN || parseInt(day) > 30 || parseInt(day) < 1)
                return false;
            const year = req.body.date.slice(6, 8);     
            if (parseInt(year) === NaN || parseInt(year) > 99 || parseInt(year) < 1)
                return false;
            return true;
        }
    }
    if (!(nameIsValid && repsIsValid && weightIsValid && unitIsValid && dateIsValid)) {
        res.set({
            'status' : '400', 
            'Content-Type' : 'application/json'
        })
        res.send({Error : "Invalid Request"});
        return;
    }

    const excerciseObj = await database.createExcercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date);
    res.set({
        'status' : '201', 
        'Content-Type' : 'application/json'
    });
    res.send(excerciseObj);
}));

app.put('/exercises/:_id', asyncHandler(async (req, res) => {
    console.log('update exercise by id');
    const nameIsValid = (req.body.name !== 'undefined' && req.body.name !== null && req.body.name !== '');
    const repsIsValid = (req.body.reps !== 'undefined' && req.body.reps > 0);  
    const weightIsValid = (req.body.weight !== 'undefined' && req.body.weight > 0);  
    const unitIsValid = (req.body.unit === 'kgs' || req.body.unit === 'lbs');
    const dateIsValid = () => {
        if (req.body.date === 'undefined' || req.body.date === null || req.body.date === '' || req.body.date.length !== 8)
            return false;
        else {
            if (req.body.date[2] !== '-' || req.body.date[5] !== '-')
                return false;
            const month = req.body.date.slice(0, 2);
            if (parseInt(month) === NaN || parseInt(month) > 12 || parseInt(month) < 1)
                return false;
            const day = req.body.date.slice(3, 5);
            if (parseInt(day) === NaN || parseInt(day) > 30 || parseInt(day) < 1)
                return false;
            const year = req.body.date.slice(6, 8);     
            if (parseInt(year) === NaN || parseInt(year) > 99 || parseInt(year) < 1)
                return false;
            return true;
        }
    }
    if (!(nameIsValid && repsIsValid && weightIsValid && unitIsValid && dateIsValid)) {
        res.set({
            'status' : '400', 
            'Content-Type' : 'application/json'
        })
        res.send({Error : "Invalid Request"});
        return;
    }

    let id = req.params._id;
    const update = {
        'name' : req.body.name,
        'reps' : req.body.reps,
        'weight' : req.body.weight,
        'unit' : req.body.unit,
        'date' : req.body.date
    }
    await database.updateExcercise({_id : id}, update);
    const updatedObj = await database.findExcercise({_id : id});
    if (updatedObj === 'undefined') {
        res.set({
            'status' : '404',
            'Content-Type' : 'application/json'
        });
        res.send({Error : "Item not found"});
        return;
    }
    res.set({
        'status' : '201', 
        'Content-Type' : 'application/json'
    });
    res.send(updatedObj);
}));

app.delete('/exercises/:_id', asyncHandler(async (req, res) => {
    console.log('delete exercise by id');
    let id = req.params._id;
    const deleted = await database.deleteExcercise({_id : id}); 
    res.set({
        'status' : '204',
    }); //prints true if there was an object to delete, false if there was no object to delete
    res.send({message : `exercise was deleted successfully: ${deleted}`, deleted : deleted});
}));

app.listen(PORT, () => {
    console.log(`express server listening on port ${PORT}`);
});