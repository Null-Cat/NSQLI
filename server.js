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

app.enable('trust proxy')
app.all('*', (req, res, next) => {
  var isLocal = (req.socket.localAddress === req.socket.remoteAddress)
  if (!argv.dev && !req.secure && !isLocal) res.redirect(308, 'https://' + req.headers.host + req.url)
  else next()
})

app.use(express.urlencoded({ extended: true }))
app.use('/sql', sql)

app.use(express.static('public'))

app.get('/', (req, res) => {
  http.get(`http://localhost:${port}/sql?request=matchhistory`, (response) => {
    let body = ''
    response.on('data', (chunk) => { body += chunk })
    response.on('end', () => {
      res.render('index', { matches: JSON.parse(body) })
    })
  })
})

app.get('/leaderboard', (req, res) => {
  http.get(`http://localhost:${port}/sql?request=leaderboard`, (response) => {
    let body = ''
    response.on('data', (chunk) => { body += chunk })
    response.on('end', () => {
      res.render('leaderboard', { leaderboardData: JSON.parse(body) })
    })
  })
})

app.all('*', (req, res) => {
  res.sendStatus(404)
});

function LogConnections(req, res, next) {
  console.log(`${clc.inverse(req.method)} request for ${clc.underline(req.url)} from ${clc.cyan(req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress)}`)
  next()
}

app.listen(port, () => {
  if (argv.dev) console.log(`${clc.yellow(`Server in development mode ${clc.bold('NO SSL')}`)}`)
  console.log(`${clc.magentaBright(`Listening on port ${port}`)}`)
})