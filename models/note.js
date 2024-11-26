const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    // minlength: 5
  },
  important: Boolean,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Customize toJSON output
noteSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
