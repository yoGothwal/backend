const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const notesRouter = require('express').Router()
const User = require('../models/user')
const Note = require('../models/note')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password are required.' });
  }
  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password must be at least 3 characters long.' });
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async(request, response)=>{
  const usersList = await User.find({})
  .populate('notes')
  .populate('blogs');
  if(usersList){
    response.json(usersList)
  }
  else{
    response.status(404).json({error: 'not found'})
  }
})
usersRouter.get('/:id', async(request, response)=>{
  const user = await User.findById(request.params.id)
  if(user){
    response.json(user)
  }
  else{
    response.status(404).json({error: 'not found'})
  }
})
usersRouter.delete('/:id', async(request, response)=>{
  const user = await User.findById(request.params.id)
  if(!user){
    return response.status(404).json({error: `user not found`})
  }
  
  await Note.deleteMany({_id: {$in : user.notes}})
  
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

usersRouter.put('/:id', async(request, response)=>{
  console.log("put req")
  const id = request.params.id
  const newUser = request.body
  const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true, runValidators: true, context: 'query' })
  response.json(updatedUser)
})

module.exports = usersRouter