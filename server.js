require('dotenv').config()
require('./server/db-conn')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')
const fs = require('fs')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(cors())

app.use('/api/thoughts', require('./server/routes/thoughts-route'));

app.get('/*', (req, res) => {
    // res.sendFile('index.html', { root: __dirname + '/client/cwpportal/build/' })
    res.send('response from server!')
})

const { PORT } = process.env

const options = {
    pfx: fs.readFileSync('mycert.pfx'),
    passphrase: ' '
  };
https.createServer(options, app)
    .listen(PORT, () => console.log(`HTTPS port ${PORT}`))  

// https.createServer(options, (req, res) => {
// console.log('from https')
// // res.writeHead(200);
// // res.end('hello world\n');
// }).listen(PORT, () => console.log(`HTTPS port ${PORT}`))

app.listen( 5001, () => {
    console.log(`listening on port 5001`)
})