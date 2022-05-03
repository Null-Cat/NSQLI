const express = require('express')
const http = require('http')
const app = express()

const port = process.env.PORT || 3000

//Routers
const sql = require('./routes/sql/sql')

app.set('view engine', 'pug')
app.set('views', './views')

app.use(LogConnections)

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
  console.log(`${req.method} request for ${req.url} from ${req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress}`)
  next()
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})