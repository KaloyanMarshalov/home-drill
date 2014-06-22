'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Exercise Schema
 */
var ExerciseSchema = new Schema({
    name: String,
    type: String,
    difficulty: String,
    muscleGroup: [String],
    equipment: String,
    picture: String,
    youTube: String
});

mongoose.model('Exercise', ExerciseSchema);