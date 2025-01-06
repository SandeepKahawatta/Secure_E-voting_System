const mongoose = require('mongoose');
// Mongoose Schema
const NomineeSchema = new mongoose.Schema({
  name: { 
    type: Object, 
    required: true,
    en: { type: String, required: true },
    si: { type: String },
    ta: { type: String }
  },
  photo: { type: String, required: true },
});
module.exports = mongoose.model('Nominee', NomineeSchema);
