'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Workout Schema
 */

var WorkoutSchema = new Schema({
    name: String,
    exrcises: [{
        name: String,
        exerciseId: String,
        type: String,   //duration or repetitions
        time: {
            type: Number,
            min: 0,
            max: 120
        }
    }]
});

mongoose.model('Workout', WorkoutSchema);