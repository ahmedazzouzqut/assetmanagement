
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    manufacturer: { type: String },
    acquisitiondate: { type: Date },
});

module.exports = mongoose.model('Asset', assetSchema);
