require('dotenv').config()
require('./server/db-conn')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

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
app.listen( PORT, () => console.log(`listening on port ${PORT}`))