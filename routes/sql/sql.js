const express = require('express')
const mysql = require('mysql')

const dbconfig = require('./dbconfig')
const con = mysql.createConnection(dbconfig.db)

const router = express.Router()

router
    .route('/')
    .get((req, res) => {
        if (!req.query.request) {
            res.sendStatus(404)
            return
    ***REMOVED***
        if (req.query.request.toLowerCase() === "matchhistory") {
            con.query('SELECT * FROM MatchHistory', (err, rows) => {
                if (err) throw err
                res.json(rows)
        ***REMOVED***)
    ***REMOVED*** else {
            res.sendStatus(404)
    ***REMOVED***
***REMOVED***)
    .post(express.json(), (req, res) => {
        if (req.body.cmd === 'add') {
            con.query('INSERT INTO MatchHistory SET ?', req.body.data, (err, result) => {
                if (err && err.code === 'ER_DUP_ENTRY') {
                    console.log('Duplicate Entry')
                    res.sendStatus(409)
                    return
            ***REMOVED***
                if (err) throw err
                res.json(result)
                console.log('Added New Match')
                console.log(result)
        ***REMOVED***)
    ***REMOVED***
***REMOVED***)

module.exports = router