let mongoose = require(`mongoose`);

let Schema = mongoose.Schema;
let Write = new Schema({
  name: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  audioPath: {
    type: String,
    required: true
  },
  createTime: {
    type: String,
    required: true
  },
  createUser: {
    type: String,
    required: true
  },
  createEmailUser: {
    type: String,
    required: true
  }

})

module.exports = mongoose.model(`Songs`, Write);