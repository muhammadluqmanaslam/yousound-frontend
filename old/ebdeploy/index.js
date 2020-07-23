// Express
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 80

const STATIC = path.resolve(__dirname, 'dist')
const INDEX = path.resolve(__dirname, 'dist', 'index.html')

const app = express()
app.use(bodyParser.json())

// Static content
app.use(express.static(STATIC))

// All GET request handled by INDEX file
app.get('*', function (req, res) {
  res.sendFile(INDEX)
})

// Start server
app.listen(PORT, function () {
  console.log('Server up and running on ', `http://localhost:${PORT}/`)
})
