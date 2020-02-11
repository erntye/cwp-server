const router = require('express').Router();
const exec = require('child_process').exec;

router.post('/plan', (req,res,next)=>{
    const exec = require('child_process').exec;
    script = 'cd ../azure-terraform && . ./export.sh && terraform plan'
    exec(script,(err,stdout,strerr) =>{
        console.log(stdout);
        res.send(stdout);
    })
});

router.post('/create', (req,res,next)=>{
    const { websiteName } = req.body
    console.log(`inputted name is ${websiteName}`)
    const exec = require('child_process').exec;
    script = 'cd ../azure-terraform && . ./export.sh && terraform plan -var "name='+ websiteName+'"'
    console.log(script)
    exec(script,(err,stdout,strerr) =>{
        console.log('executed command')
        console.log(stdout);
        res.send(stdout);
    })
});

module.exports = router;