const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', ''); // Attach token to request
  } else {
    request.token = null; // No token found
  }
  next();
};
const userExtractor = async (request, response, next) =>{
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)
  request.user = user
  next()
}
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
    response.status(400).json({ error: 'MalID' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: "Validation failed"})
  }
  else if (error.name === 'AxiosError') {
    return response.status(400).json({  })
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  else if(error.name == 'JsonWebTokenError'){
    return response.status(401).json({error: 'Invalid Token'})
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
  })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}