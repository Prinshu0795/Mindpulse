const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stress: {
        type: Number,
        required: true
    },
    anxiety: {
        type: Number,
        required: true
    },
    trigger: {
        type: String,
        default: 'Unknown'
    },
    date: {
        type: String, // E.g., 'Mon', 'Tue'
        required: true
    },
    fullDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);
