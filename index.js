const express = require('express')
const app = express()

const port = process.env.PORT || 3000

//Routers
const sql = require('./routes/sql/sql')

app.use(LogConnections)

app.use(express.urlencoded({ extended: true ***REMOVED***))
app.use('/sql', sql)

app.use(express.static('public'))

function LogConnections(req, res, next) {
    console.log(`${req.method***REMOVED*** request for ${req.url***REMOVED*** from ${req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress***REMOVED***`)
    next()
***REMOVED***

app.listen(port, () => {
  console.log(`Listening on port ${port***REMOVED***`)
***REMOVED***)