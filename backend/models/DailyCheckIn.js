const mongoose = require('mongoose');

const dailyCheckInSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        enum: ['Very Happy', 'Happy', 'Neutral', 'Anxious', 'Stressed', 'Sad', 'Irritated'],
        required: true
    },
    stressLevel: {
        type: Number, // 1 to 10
        min: 1,
        max: 10,
        required: true
    },
    anxietyLevel: {
        type: Number, // 1 to 10
        min: 1,
        max: 10,
        required: true
    },
    energyLevel: {
        type: Number, // 1 to 10
        min: 1,
        max: 10,
        required: true
    },
    sleepQuality: {
        type: Number, // 1 to 10
        min: 1,
        max: 10,
        required: true
    },
    stressTriggers: {
        type: [String],
        default: []
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DailyCheckIn', dailyCheckInSchema);
