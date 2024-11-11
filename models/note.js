const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema( {
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
})

// Customize toJSON output
noteSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
