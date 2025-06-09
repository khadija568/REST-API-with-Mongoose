const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },    // User's name
  email: { type: String, required: true },   // User's email
  age: { type: Number },                      // User's age (optional)
});

module.exports = mongoose.model('User', userSchema);
