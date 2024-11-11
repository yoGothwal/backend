const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const Note = require('./models/note')
const Person = require('./models/person')
const password = process.env.DB_PASSWORD
const url = process.env.MONGODB_URI

const app = express()
const PORT = process.env.NODE_ENV === 'production' ? 3001 : 5000

const cors = require('cors')
app.use(cors())
app.use(express.json())

// Function to connect to MongoDB and start the server
const startServer = async () => {
  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB Atlas')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

startServer()


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
if (process.argv.length === 3) {
  Person.find({})
    .then((result) => {
      console.log('Phonebook entries:')
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })

    })
    .catch((error) => {
      console.error('Error fetching entries:', error)

    })

} else if (process.argv.length === 5) {
  // Add a new entry if name and number are provided
  const name = process.argv[3]
  const number = process.argv[4]
  Person.findOne({ name: name })
    .then(res => {
      if(res){
        console.log('Person already exists. Please add another name.')
      }
      else{
        const person = new Person({
          name,
          number,
        })
        person.save().then(() => {
          console.log(`Saved entry ${name}`)
          mongoose.connection.close()
        })
          .catch(error => {
            console.log(`Error adding ${name}`)
            mongoose.connection.close()
          })
      }
    })
    .catch((error) => {
      console.error('Error checking for duplicates:', error)
      mongoose.connection.close()
    })
}
else{
  console.log('Please provide both the name and number, or only the password to display all entries')
}

const deleteAll = async () => {
  try {
    await Note.deleteMany({})
    await Person.deleteMany({})
  } catch (error) {
    console.log(error)
  }
}

// Get
app.get('/notes/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)

    if (note) {
      response.json(note) // Return the found note
    } else {
      response.status(404).json({ error: 'Note not found' }) // Use 404 if note is not found
    }
  } catch (error) {
    next(error)
  }
})

app.get('/notes', async (request, response) => {
  try {
    const notes = await Note.find({})
    if(notes){
      response.json(notes)
    }else{
      response.status(500).json({ error: 'not found' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Error fetching notes' })
  }
})

app.post('/notes', async (req, res, next) => {
  const { content, important } = req.body
  const note = new Note({ content, important })
  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => {
      next(error)
    })
})



// Delete a note by id
app.delete('/notes/:id', async (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/notes/:id', (req, res, next) => {
  const id = req.params.id
  console.log(`Received PUT request to update note with id: ${id}`)
  console.log('Request body:', req.body)

  const note = {
    content: req.body.content,
    important: req.body.important,
  }

  Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => {
      next(error) // Pass the error to error handling middleware
    })
})

// Get information about the phone book (person count)
app.get('/info', async (req, res) => {
  const requestTime = new Date().toLocaleString()
  const entryCount = await Person.countDocuments({})
  res.json({
    message: `Phone book has ${entryCount} people`,
    time: requestTime
  })
})

// Get all persons
app.get('/persons', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
})

// Get a person by id
app.get('/persons/:id', async (request, response, next) => {
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
app.delete('/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Create a new person
app.post('/persons', async (req, res, next) => {
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

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if(error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted ID' })
  }
  else if(error.name === 'ReferenceError') {
    return response.status(400).json({ error: 'MalID' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'AxiosError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
app.use(unknownEndpoint)
