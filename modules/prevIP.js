const mongoose = require('mongoose');

const prevIPSchema = mongoose.Schema({
    clientIP: { type: String, required: true }
});

module.exports = mongoose.model('PrevIP', prevIPSchema);