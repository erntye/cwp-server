const router = require('express').Router();
const Website = require('../models/Website');

router.get('/', (req,res,next) => {
    Website.find({}, (err, website)=> {
        if (err) next(err);
        else res.json(website);
    });
});

router.post('/initialize', (req,res,next)=>{
    for (let x =1; x<=5; x++ ){
        const newWebsite = new Website({
            websiteName: `website ${x}`,
            dateCreated: new Date(),
        });
        newWebsite.save( err=>{
            if (err) console.log(err);
            else console.log('website saved!')
        });
    }
    res.send('initialize. run get after this');
});

router.post('/create', (req,res,next)=> {
    const {websiteName} = req.body;
    const newWebsite = new Website({
        websiteName,
        dateCreated: new Date(),
    });
    newWebsite.save(err => {
        if (err) next (err);
        else res.json({ newWebsite, msg:'website successfully saved!'});
    });
});

router.delete('/', (req,res,next) => {
    Website.deleteMany({}, err=>{
        if (err) next(err);
        else res.send('Successfully deleted all websites');
    });
});

module.exports = router;