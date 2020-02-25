const mongoose = require('mongoose')

const WebsiteSchema = mongoose.Schema({
  websiteName: { type:String, unique:true },
  dateCreated: Date,
  status: String,
  //permissions:user list
  //terraform version
});

const Website = mongoose.model('Website', WebsiteSchema)
Website.createIndexes();
module.exports = Website;