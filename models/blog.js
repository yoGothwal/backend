const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  author: String,
  url: String,
  likes: {
    type: String,
    default: 0,
  },
})
blogSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
}
)
const Blog = new mongoose.model('Blog', blogSchema)
module.exports = Blog