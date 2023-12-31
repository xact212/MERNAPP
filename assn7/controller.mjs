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
    let excerciseArr = 'undefined';
    try {
        excerciseArr = await database.findExcerciseById(req.params._id);
    }
    catch (err) {
        console.log(err);
        res.set({
            'status' : '400',
            'Content-Type' : 'application/json'
        });
        res.send({Error : "Internal database error"});
        return;
    }
    if (typeof(excerciseArr) === 'undefined' || excerciseArr === null) {
        res.set({
            'status' : '404',
            'Content-Type' : 'application/json'
        });
        res.send({Error : "Not found"});
        return;
    }
    res.set({
        'status' : '200',
        'Content-Type' : 'application/json',
    });
    res.send(excerciseArr);
}));

app.post('/exercises', asyncHandler(async (req, res) => {
    console.log("create excercise");
    const nameIsValid = (typeof(req.body.name) !== 'undefined' && req.body.name !== null && req.body.name !== '');
    const repsIsValid = (typeof(req.body.reps) !== 'undefined' && req.body.reps > 0);  
    const weightIsValid = (typeof(req.body.weight) !== 'undefined' && req.body.weight > 0);  
    const unitIsValid = ((req.body.unit === 'kgs' || req.body.unit === 'lbs') || typeof(req.body.unit === 'undefined'));
    console.log(req.body.date);
    function dateIsValid () {
        console.log("checking if date is valid");
        if (typeof(req.body.date) === 'undefined' || req.body.date === null || req.body.date === '')
            return false;
        if (req.body.date.length !== 8)
            return false;
        else {
            if (req.body.date[2] !== '-' || req.body.date[5] !== '-')
                return false;
            const month = req.body.date.slice(0, 2);
            console.log(parseInt(month));
            if (isNaN(parseInt(month)) || parseInt(month) > 12 || parseInt(month) < 1)
                return false;
            const day = req.body.date.slice(3, 5);
            if (isNaN(parseInt(day)) || parseInt(day) > 30 || parseInt(day) < 1)
                return false;
            const year = req.body.date.slice(6, 8);     
            if (isNaN(parseInt(year)) || parseInt(year) > 99 || parseInt(year) < 1)
                return false;
            console.log(`date ${req.body.date} is valid!`);
            return true;
        }
    }
    if (!nameIsValid || !repsIsValid || !weightIsValid || !unitIsValid || !dateIsValid()) {
        console.log(`date ${req.body.date} is invalid!`);
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
    const nameIsValid = (typeof(req.body.name) !== 'undefined' && req.body.name !== null && req.body.name !== '');
    const repsIsValid = (typeof(req.body.reps) !== 'undefined' && req.body.reps > 0);  
    const weightIsValid = (typeof(req.body.weight) !== 'undefined' && req.body.weight > 0);  
    const unitIsValid = ((req.body.unit === 'kgs' || req.body.unit === 'lbs') || typeof(req.body.unit === 'undefined'));
    console.log(req.body.date);
    function dateIsValid () {
        console.log("checking if date is valid");
        if (typeof(req.body.date) === 'undefined' || req.body.date === null || req.body.date === '')
            return false;
        if (req.body.date.length !== 8)
            return false;
        else {
            if (req.body.date[2] !== '-' || req.body.date[5] !== '-')
                return false;
            const month = req.body.date.slice(0, 2);
            if (isNaN(parseInt(month)) || parseInt(month) > 12 || parseInt(month) < 1)
                return false;
            const day = req.body.date.slice(3, 5);
            if (isNaN(parseInt(day)) || parseInt(day) > 30 || parseInt(day) < 1)
                return false;
            const year = req.body.date.slice(6, 8);     
            if (isNaN(parseInt(year)) || parseInt(year) > 99 || parseInt(year) < 1)
                return false;
            console.log(`date ${req.body.date} is valid!`);
            return true;
        }
    }
    if (!nameIsValid || !repsIsValid || !weightIsValid || !unitIsValid || !dateIsValid()) {
        console.log(`date ${req.body.date} is invalid!`);
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
    const updatedObj = null;
    try {
        await database.updateExcercise({_id : id}, update);
        updatedObj = await database.findExcercise({_id : id});
    }
    catch {
        res.set({
            'status' : '404',
            'Content-Type' : 'application/json'
        });
        res.send({Error : "Item not found"});
        return;
    }
    if (updatedObj === null || typeof(updatedObj) === 'undefined')
    {
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
    if (deleted === true) {
        res.set({
            'status' : '204',
        }); 
    }
    else {
        res.set({
            'status' : '404',
        }); 
    }
    res.send({message : `exercise was deleted successfully: ${deleted}`, deleted : deleted});
}));

app.listen(PORT, () => {
    console.log(`express server listening on port ${PORT}`);
});