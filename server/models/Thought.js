const mongoose = require('mongoose')

const ThoughtSchema = mongoose.Schema({
    thought: String,
    dateCreated: Date,
});

const Thought = mongoose.model('Thought', ThoughtSchema)

module.exports = Thought;