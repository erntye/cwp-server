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
router.post('/create', (req, res, next) => {
  const { websiteName } = req.body;
  if (websiteName == null) { return (res.status(550).send('Empty Input')) }
  if (!websiteName || websiteName.trim().length === 0) {
    return (res.status(501).send('Invalid website name'))
  }
  const newWebsite = new Website({
    websiteName,
    dateCreated: new Date(),
  });
  newWebsite.save(err => {
    if (err) next(err);
    else res.json({ newWebsite, msg: 'website successfully saved!' });
  });


});

router.delete('/', (req, res, next) => {
  const { websiteName } = req.body;
  console.log(websiteName)
  if (websiteName == null) { return (res.status(550).send('Empty Input')) }
  if (!websiteName || websiteName.trim().length === 0) {
    return (res.status(551).send('Invalid website name'))
  }
  console.log(`trying to delete ${websiteName}`)
  Website.findOneAndDelete({ websiteName: websiteName }, (err, doc) => {
    console.log(doc)
    if (err) next(err);
    else if (!doc) res.status(552).send(`Couldn't find website`);
    else res.send(`Successfully deleted website ${websiteName}`);
  })
});




module.exports = router;