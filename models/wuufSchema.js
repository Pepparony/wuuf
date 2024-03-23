const mongoose = require('mongoose')
const User = require('./User.js')

const DogSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false,
    },
    location: {
        type: String,
    },
    breed: {
        type: String,
        required: false,
    },
    description: {
        type: String,
    },

    dogFriendly: {
        type: String,
        required: true,
    },
    humanFriendly: {
        type: String,
        required: true,
    },
    shots: {
        type: String,
        required: true,
    },
    injured: {
        type: String,
        required: true,
    },
    trained: {
        type: String,
        required: true,
    },
    available: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
        enum: ['Male','Female',]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    images:[
        {
            url: String,
            filename: String,
        }
    ]
})


module.exports = new mongoose.model('Dog', DogSchema)