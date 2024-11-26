const config = require('./utilis/config')
const logger = require('./utilis/logger')
const app = require('./app')
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
// Function to connect to MongoDB and start the server

