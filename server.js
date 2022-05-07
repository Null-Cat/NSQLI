const express = require('express')
const http = require('http')
const clc = require('cli-color')
const argv = require('yargs')(process.argv.slice(2))
  .command('dev', 'Run the server in development mode')
  .alias('dev', 'd')
  .argv

const app = express()

const port = process.env.PORT || 3000

//Routers
const sql = require('./routes/sql/sql')

app.set('view engine', 'pug')
app.set('views', './views')

app.use(LogConnections)

app.get('*', function (req, res, next) {
  if (!argv.dev && req.protocol === 'http') res.redirect('https://' + req.headers.host + req.url)
  else next()
***REMOVED***)

app.use(express.urlencoded({ extended: true ***REMOVED***))
app.use('/sql', sql)

app.use(express.static('public'))

app.get('/', (req, res) => {
  http.get(`http://localhost:${port***REMOVED***/sql?request=matchhistory`, (response) => {
    let body = ''
    response.on('data', (chunk) => { body += chunk ***REMOVED***)
    response.on('end', () => {
      res.render('index', { matches: JSON.parse(body) ***REMOVED***)
***REMOVED***)
  ***REMOVED***)
***REMOVED***)

app.get('/leaderboard', (req, res) => {
  http.get(`http://localhost:${port***REMOVED***/sql?request=leaderboard`, (response) => {
    let body = ''
    response.on('data', (chunk) => { body += chunk ***REMOVED***)
    response.on('end', () => {
      res.render('leaderboard', { leaderboardData: JSON.parse(body) ***REMOVED***)
***REMOVED***)
  ***REMOVED***)
***REMOVED***)

app.all('*', (req, res) => {
  res.sendStatus(404)
***REMOVED***);

function LogConnections(req, res, next) {
  console.log(`${clc.inverse(req.method)***REMOVED*** request for ${clc.underline(req.url)***REMOVED*** from ${clc.blue(req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress)***REMOVED***`)
  next()
***REMOVED***

app.listen(port, () => {
  console.log(`${clc.yellow(`Server in development mode ${clc.bold('NO SSL')***REMOVED***`)***REMOVED***`)
  console.log(`${clc.magenta(`Listening on port ${port***REMOVED***`)***REMOVED***`)
***REMOVED***)