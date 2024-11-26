const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor , tokenExtractor} = require('../utilis/middleware')
const notesRouter = require('express').Router()

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }
// Get
notesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id
  const note = await Note.findById(id)
  if (note) {
  response.json(note) // Return the found note
  } else {
  response.status(404).json({ error: 'Note not found' }) // Use 404 if note is not found
  }
})

notesRouter.get('/', async (request, response) => {
  console.log("Total notes ",request.user.notes.length)
  const notes = await Note.find({}).populate('user', {username: 1, name: 1, })
  if(notes){
    response.json(notes)
  }else{
    response.status(404).json({ error: 'not found' })
  }
})

notesRouter.post('/', async (req, res, next) => {
  // const decodedToken = jwt.verify(req.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // console.log("decoded token: ",decodedToken)
  const id =  req.user.id
  const user = await User.findById(id)
  console.log("posting note in ", user.username)
  const newNote = new Note({
    content: req.body.content,
    important: req.body.important === undefined ? false : req.body.important,
    user: user.id,
  })

  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  res.status(201).json(savedNote)
})



// Delete a note by id
notesRouter.delete('/:id', async (req, res, next) => {
  console.log("del req -")
  if(!req.token){
      console.log('failed')
      return
  }
  const id = req.params.id
  const {user} = req
  user.notes = user.notes.filter(noteID=> noteID.toString() !== id)
  await user.save()
  await Note.findByIdAndDelete(id)
  console.log("Note deleted")
  res.status(204).end()
})

notesRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  console.log(`Received PUT request to update note with id: ${id}`)


  const note = {
    content: req.body.content,
    important: req.body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
  res.json(updatedNote)
})
module.exports= notesRouter