const Blog = require('../models/blog')
const Note = require('../models/note')
const User = require('../models/user')


const usersInDb = async()=>{
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]
const initialBlogs = [
  {
    title: "Modi vs bjp",
    author: 'ravish',
    url: "politics.com",
    likes: 9
  },
  {
    title: "Indian People",
    author: 'mukharje',
    url: "indiandiplomat.com",
    likes: 23
  },
  
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialNotes,
  initialBlogs,
  nonExistingId,
  notesInDb,
  blogsInDb,
  usersInDb,
}