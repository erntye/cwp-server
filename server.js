require('dotenv').config()
require('./project/db-conn')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')
const fs = require('fs')
// const exec = require('child_process').exec;

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use('/api/exec', require('./project/routes/terraform-route'));
app.use('/api/website', require('./project/routes/website-route'));

app.get('/*', (req, res) => {
  // res.sendFile('index.html', { root: __dirname + '/client/cwpportal/build/' })
  res.send('response from server!')
})


// script = `cd ../azure-terraform && . ./export.sh && 
//     if [ -d "teseet" ]; 
//     then
//     terraform destroy -auto-approve && cd ../ && rm -r test
//     else
//     echo 'not exists'
//     fi 
//     `

// exec(script, (err, stdout, strerr) =>
//     {
//         console.log(stdout);//this would work
//         console.log(strerr);
//     })



const { PORT } = process.env

const options = {
  pfx: fs.readFileSync('mycert.pfx'),
  passphrase: ' '
};
https.createServer(options, app)
  .listen(PORT, () => console.log(`HTTPS port ${PORT}`))

app.listen(5001, () => {
  console.log(`listening on port 5001`)
})