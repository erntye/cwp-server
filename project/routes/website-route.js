// import { terraformCreate } from '../controllers/terraform.js';
require('../controllers/terraform')

const router = require('express').Router();
const Website = require('../models/Website');


router.get('/', (req, res, next) => {
  Website.find({}, (err, website) => {
    if (err) next(err);
    else res.json(website);
  });
});

router.post('/initialize', (req, res, next) => {
  var promiseList = [];
  for (let x = 1; x <= 5; x++) {
    const newWebsite = new Website({
      websiteName: `website ${x}`,
      dateCreated: new Date(),
    });
    promiseList.push(
      newWebsite.save()
        .then(err => {
          if (err) console.log(err);
          else console.log(`website ${newWebsite.websiteName} saved!`)
        })
    );
  }
  // ensure that all data is saved before resolving
  Promise.all(promiseList)
    .then(() => { console.log('done'); res.send('initialize. run get after this') })
    .catch((err) => console.log(err))
});


router.delete('/all', (req, res, next) => {
  Website.deleteMany({}, err => {
    if (err) next(err);
    else res.send('Successfully deleted all websites');
  });
});


//TODO add some server side logic to check the db and sync
// create website and returns the updated database
router.post('/create', (req, res, next) => {
  var { websiteName, websiteSize } = req.body;
  if (websiteName == null) { return (res.status(550).send('Empty Input')) }
  if (!websiteName || websiteName.trim().length === 0) {
    return (res.status(551).send('Invalid website name'))
  }
  websiteName = websiteName.trim()
  const newWebsite = new Website({
    websiteName,
    dateCreated: new Date(),
    status: 'creating',
  });
  newWebsite.save()
    .then(() => {
      console.log(`website ${websiteName} saved`)
      // return new database results
      return Website.find()
        .then(websites => {
          console.log(websites);
          res.send(websites);
        })
    })
    .then((websites) => {
      // call terraform script
      console.log('performing terraform create')
      terraformCreate(websiteName, websiteSize)
    })
    .catch(e => {
      console.log(e)
      if (e.name == 'MongoError' && e.code==11000) {
       res.status(552).send('Website name taken')
     }
      // next(e);
    })
});

router.delete('/', (req, res, next) => {
  const { websiteName } = req.body;
  console.log(websiteName)
  if (websiteName == null) { return (res.status(550).send('Empty Input')) }
  if (!websiteName || websiteName.trim().length === 0) {
    return (res.status(551).send('Invalid website name'))
  }
  console.log(`trying to delete ${websiteName}`)
  Website.findOneAndDelete({ websiteName: websiteName })
    .then(obj => {
      console.log(obj)
      if (!obj) {
        (res.status(552).send(`Couldn't find website`));
        throw new Error('Couldnt find website')
      }
    })
    .then(() => {
      // return new database results
      return Website.find()
        .then(websites => res.send(websites))
    })
    .then(() => {
      console.log('performing terraform delete')
      terraformDelete(websiteName)
    })
    .catch(e => console.error(e))
});



module.exports = router;