const express = require('express')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

const dbconfig = require('./dbconfig')
const con = mysql.createConnection(dbconfig.db)
const jwtSecret = 'SnowD0wnVERYsEcReTPaSSw0Rd'

const router = express.Router()

router.use(authenticateJWT)

router
    .route('/')
    .get((req, res) => {
        if (!req.query.request) {
            res.sendStatus(404)
            return
        }
        if (req.query.request.toLowerCase() === "matchhistory") {
            con.connect()
            con.query('SELECT * FROM MatchHistory', (err, rows) => {
                if (err) throw err
                res.json(rows)
            })
            con.end()
        } else {
            res.sendStatus(404)
        }
    })
    .post(express.json(), (req, res) => {
        if (req.body.cmd === 'add') {
            con.connect()
            con.query('INSERT INTO MatchHistory SET ?', req.body.data, (err, result) => {
                if (err && err.code === 'ER_DUP_ENTRY') {
                    console.log('Duplicate Entry')
                    res.sendStatus(409)
                    return
                }
                if (err) throw err
                res.json(result)
                console.log('Added New Match')
                console.log(result)
            })
            con.end()
        }
    })

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) return res.sendStatus(403)
            console.log(user)
            req.user = user
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

module.exports = router