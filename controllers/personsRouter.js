const Person = require('../models/person')
const personsRouter = require('express').Router()
// Get all persons
personsRouter.get('/', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
})

// Get a person by id
personsRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)

    if (person) {
      response.json(person) // Return the found note
    } else {
      response.status(404).json({ error: 'Person not found' }) // Use 404 if note is not found
    }
  } catch (error) {
    next(error)
  }
})

// Delete a person by id
personsRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Create a new person
personsRouter.post('/', async (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }

  // Check if name or number already exists
  const existingPerson = await Person.findOne({ $or: [{ name }, { number }] })
  if (existingPerson) {
    return res.status(400).json({ error: 'Name or number already taken' })
  }
  if(number.length <8){
    return res.status(400).json({ error: 'Number length < 8' })
  }
  const person = new Person({ name, number })
  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => {
      next(error)
    })
})
module.exports = personsRouter