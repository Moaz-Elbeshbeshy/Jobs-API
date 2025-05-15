const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        minlength: 2,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        minlength: 3,
        maxlength: 50,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true })


jobSchema.index({ company: 1, position: 1, createdBy: 1 }, { unique: true })


module.exports = mongoose.model('Job', jobSchema)