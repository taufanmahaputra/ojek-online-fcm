const mongoose = require('mongoose');

// Schema user login
var loginSchema = mongoose.Schema({
  username: String,
  tokenFCM: String
});


const login = module.exports = mongoose.model("login", loginSchema);