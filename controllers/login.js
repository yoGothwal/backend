const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  console.log("request ",request.body)

  const user = await User.findOne({ username })
  console.log(user)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  console.log(passwordCorrect)
  
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60*60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
loginRouter.get('/',async (req, res)=>{
    res.json({message: "Hello"})
})

module.exports = loginRouter