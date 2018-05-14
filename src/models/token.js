const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

tokenSchema.methods.isValid = function () {
  const minutes = (Date.now() - this.createdAt.getTime()) / 1000 / 60
  return minutes < 30
}

module.exports = mongoose.model('Token', tokenSchema)