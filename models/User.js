const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  nic: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hasVoted: { type: Boolean, default: false },
});
module.exports = mongoose.model('User', UserSchema);
