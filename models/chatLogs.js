const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    sender: { type: String, required: true },
    content: { type: String, required: true },
    intent: { type: String }
});

const ChatLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [MessageSchema]
});

module.exports = mongoose.model('ChatLog', ChatLogSchema);
