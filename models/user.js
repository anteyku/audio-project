let mongoose = require(`mongoose`);

let Schema = mongoose.Schema;
let User = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  emailAccept: {
    type: Boolean,
    required: true
  },
  emailToken: String,
  emailTokenExp: Date,
  resetToken: String,
  resetTokenExp: Date
})


module.exports = mongoose.model(`User`, User);