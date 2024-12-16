const express = require('express')
const mongoose = require('mongoose')
const config = require('./utilis/config')
const middleware = require('./utilis/middleware')
const app = express()
const cors = require('cors')
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://frontend-4-te7v.onrender.com']
    : ['http://localhost:5173'],  // Allow localhost during development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions))

app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);

const notesRouter = require('./controllers/notesRouter')
const blogsRouter = require('./controllers/blogsRouter')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


// Use routes
app.use(express.json())
app.use('/notes', middleware.userExtractor, notesRouter)
app.use('/blogs', middleware.userExtractor, blogsRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/testing', testingRouter)
}



app.use(express.static('dist'))
mongoose.set('strictQuery', false)

const startServer = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB Atlas')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
startServer()
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Middlewares
app.use(middleware.unknownEndpoint) // Unknown endpoint middleware
app.use(middleware.errorHandler)

module.exports = app
