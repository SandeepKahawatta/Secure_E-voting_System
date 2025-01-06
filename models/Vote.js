const mongoose = require('mongoose');
const VoteSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nomineeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nominee', required: true },
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Vote', VoteSchema);
