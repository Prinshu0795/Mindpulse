const mongoose = require('mongoose');

const mentalAssessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['PSS-10', 'GAD-7', 'DASS-21', 'PHQ-9', 'WHO-5'],
        required: true
    },
    score: {
        type: Number,
        required: function() { return this.type !== 'DASS-21'; } // DASS-21 uses subScores instead of a single total score
    },
    subScores: {
        depression: Number,
        anxiety: Number,
        stress: Number
    },
    responses: {
        type: [Number],
        default: []
    },
    severity: {
        type: String,
        default: 'Unknown'
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MentalAssessment', mentalAssessmentSchema);
