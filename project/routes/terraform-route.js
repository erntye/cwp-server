const router = require('express').Router();
const exec = require('child_process').exec;

router.post('/plan', (req, res, next) => {
  const exec = require('child_process').exec;
  script = 'cd ../azure-terraform && . ./export.sh && terraform plan'
  exec(script, (err, stdout, strerr) => {
    console.log(stdout);
    res.send(stdout);
  })
});

router.post('/create', (req, res, next) => {
  const { websiteName } = req.body
  console.log(`input name to create is ${websiteName}`)
  const exec = require('child_process').exec;
  //script = 'cd ../azure-terraform && . ./export.sh && terraform plan -var "name='+ websiteName+'"'
  script = `cd ../azure-terraform && . ./export.sh && mkdir ${websiteName} && 
    cp ./init/main.tf ./${websiteName}/main.tf && cp ./init/outputs.tf ./${websiteName}/outputs.tf && cp ./init/variables.tf ./${websiteName}/variables.tf &&
    cp ./init/terraform.tfvars ./${websiteName}/terraform.tfvars &&
    cd ${websiteName} && terraform init && terraform plan -var "name=${websiteName}"`

  // script = `cd ../azure-terraform && . ./export.sh && mkdir ${websiteName} && 
  // cp ./init/main.tf ./${websiteName}/main.tf && cp ./init/outputs.tf ./${websiteName}/outputs.tf && cp ./init/variables.tf ./${websiteName}/variables.tf &&
  // cp ./init/terraform.tfvars ./${websiteName}/terraform.tfvars &&
  // cd ${websiteName} && terraform init && terraform apply -auto-approve -var "name=${websiteName}"`

  console.log(script)
  exec(script, (err, stdout, stderr) => {
    if (err) {
      console.error(`${err}`)
      throw err
    }
    console.log('executed create command')
    console.log(stdout);
    console.error(stderr)
    if (stderr) { res.send(stderr) }
    else { res.send(stdout) }


  })
});

router.delete('/', (req, res, next) => {
  /* 
  Performs terraform destroy on resources and removes the folder after that
  */
  const { websiteName } = req.body
  console.log(`input name to delete is ${websiteName}`)
  const exec = require('child_process').exec;
  // script = `cd ../azure-terraform && . ./export.sh && cd ${websiteName} && 
  //   terraform destroy -auto-approve -var 'name=${websiteName}' && cd ../ && rm -r ${websiteName}`
  script = `cd ../azure-terraform && . ./export.sh && 
    if [ -d ${websiteName} ]; 
    then
    cd ${websiteName} && terraform destroy -auto-approve -var 'name=${websiteName}' && cd ../ && rm -r ${websiteName}
    else
    echo 'not exists'
    fi 
    `
  console.log(script)
  exec(script, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error ${err}`)
      throw err
    }
    console.log('executed delete command')
    console.log(stdout);
    console.error(stderr)
    if (stderr) { res.send(stderr) }
    else { res.send(stdout) }
  })
});

module.exports = router;