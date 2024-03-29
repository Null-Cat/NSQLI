const express = require('express')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const clc = require('cli-color')

const dbconfig = require('./dbconfig')
const pool = mysql.createPool(dbconfig.db)
const jwtSecret = 'SnowD0wnVERYsEcReTPaSSw0Rd'

const router = express.Router()

router
	.route('/')
	.get((req, res) => {
		if (req.query.request && req.query.request.toLowerCase() === 'matchhistory') {
			pool.query('SELECT * FROM MatchHistory ORDER BY EndTime DESC', (err, rows) => {
				if (err) { res.sendStatus(404); return }
				res.json(rows)
			})
		} else if (req.query.request && req.query.request.toLowerCase() === 'leaderboard') {
			pool.query('SELECT Player1User AS Username, Player1FinalScore AS Score, Player1HeadShotCount AS Headshots, EndTime AS ScoreSetAt, MatchID FROM MatchHistory UNION ALL SELECT Player2User AS Username, Player2FinalScore AS Score, Player2HeadShotCount AS Headshots, EndTime AS ScoreSetAt, MatchID FROM MatchHistory ORDER BY Score DESC',
				(err, rows) => {
					if (err) { res.sendStatus(404); return }
					res.json(rows)
				})
		} else if (req.query.matchid) {
			pool.query('SELECT * FROM MatchHistory WHERE MatchID = ?', req.query.matchid.toString(), (err, rows) => {
				if (err) { res.sendStatus(404); return }
				res.json(rows)
			})
		} else {
			res.sendStatus(404)
		}
	})
	.post(authenticateJWT, express.json(), (req, res) => {
		if (req.body.cmd === 'add') {
			pool.query('INSERT INTO MatchHistory SET ?', req.body.data, (err, result) => {
				if (err && err.code === 'ER_DUP_ENTRY') {
					console.log(`${clc.red('Duplicate entry')}`)
					res.sendStatus(409)
					return
				}
				if (err) throw err
				res.json(result)
				console.log(`${clc.green('Added New Match: ')}${clc.cyan.bold(req.body.data.MatchID)}`)
			})
		}
	})

function authenticateJWT(req, res, next) {
	const authHeader = req.headers.authorization

	if (authHeader) {
		const token = authHeader.split(' ')[1]

		jwt.verify(token, jwtSecret, (err, user) => {
			if (err) {
				console.log(`${clc.red('Invalid/Unauthorized Token')}`)
				return res.sendStatus(403)
			}
			console.log(user)
			req.user = user
			next()
		})
	} else {
		console.log(`${clc.red('Not Authenticated')}`)
		res.sendStatus(401)
	}
}

module.exports = router