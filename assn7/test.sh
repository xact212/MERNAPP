#!/bin/bash

curl -X POST localhost:3000/exercises -H "Content-Type: application/json" -d '{"name" : "ohp", "reps" : "5", "weight" : "100", "unit" : "lbs", "date" : "08-04-23"}'
echo ""
curl -X POST localhost:3000/exercises -H "Content-Type: application/json" -d '{"name" : "bench", "reps" : "15", "weight" : "135", "unit" : "lbs", "date" : "08-04-23"}'
echo ""
curl -X GET localhost:3000/exercises
echo ""
curl -X GET localhost:3000/exercises/64cd4734794c5ec25a08cd93 #replace with id in database
echo ""
curl -X PUT localhost:3000/exercises/64cd4734794c5ec25a08cd93 -H "Content-Type: application/json" -d '{"name" : "squat", "reps" : "6", "weight" : "225", "unit" : "lbs", "date" : "08-01-23"}'
echo ""
curl -X DELETE localhost:3000/exercises/64cd4734794c5ec25a08cd93
echo ""