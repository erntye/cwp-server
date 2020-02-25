const util = require('util');
const exec = util.promisify(require('child_process').exec);
const azure_mappings = require('../util/azure_sizings');

terraformPlan = () => {
  script = 'cd ../azure-terraform && . ./export.sh && terraform plan'
  return exec(script, (err, stdout, strerr) => {
    console.log(stdout);
    stdout;
  })
}

terraformCreate = (websiteName, websiteSize) => {
  // validate input
  let { tier, size, sku } = azure_mappings[websiteSize.toLowerCase()]
  script = `cd ../azure-terraform && . ./export.sh && mkdir ${websiteName} && 
    cp ./init/main.tf ./${websiteName}/main.tf && cp ./init/outputs.tf ./${websiteName}/outputs.tf && cp ./init/variables.tf ./${websiteName}/variables.tf &&
    cp ./init/terraform.tfvars ./${websiteName}/terraform.tfvars &&
    cd ${websiteName} && terraform init &&
    terraform plan -var "name=${websiteName}" -var "size=${size}" -var "tier=${tier}" -var "sku_name=${sku}"`

  // script = `cd ../azure-terraform && . ./export.sh && mkdir ${websiteName} && 
  // cp ./init/main.tf ./${websiteName}/main.tf && cp ./init/outputs.tf ./${websiteName}/outputs.tf && cp ./init/variables.tf ./${websiteName}/variables.tf &&
  // cp ./init/terraform.tfvars ./${websiteName}/terraform.tfvars &&
  // cd ${websiteName} && terraform init && terraform apply -auto-approve -var "name=${websiteName}"`

  // console.log(script)
  return exec(script)
    .then(obj => {
      let { stderr, stdout } = obj
      // console.log(obj)
      console.log('executed create command')
      console.log('stdout: ', stdout.substring(0, 100));
      console.log('stderr: ', stderr)
      if (stderr) { return stderr }
      else { return stdout }
    })
    .catch((e) => {
      console.error(e);
    })
}

terraformDelete = (websiteName) => {
  console.log(`input name to delete is ${websiteName}`)
  script = `cd ../azure-terraform && . ./export.sh && 
    if [ -d ${websiteName} ]; 
    then
    cd ${websiteName} && terraform destroy -auto-approve -var 'name=${websiteName}' && cd ../ && rm -r ${websiteName}
    else
    echo 'not exists'
    fi 
    `
  // console.log(script)
  return exec(script)
    .then((obj) => {
      let { stderr, stdout } = obj
      console.log('executed delete command')
      console.log('stdout: ', stdout.substring(0, 100));
      console.log('stderr: ', stderr)
      if (stderr) { return stderr }
      else { return stdout }
    })
    .catch((e) => {
      console.error(e);
    });
}
