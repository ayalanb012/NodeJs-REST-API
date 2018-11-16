const mongoose = require('mongoose');

const statsEntrySchema = mongoose.Schema({
    requestType: {type: String, enum: ['PREV', 'TOTAL', 'STATS']},
    clientIP: { type: String, required: true },
    counter: { type: Number, required: true }
});

module.exports = mongoose.model('StatsEntry', statsEntrySchema);