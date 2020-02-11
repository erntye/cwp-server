const mongoose = require('mongoose')

const WebsiteSchema = mongoose.Schema({
    websiteName: String,
    dateCreated: Date,
});

const Website = mongoose.model('Website', WebsiteSchema)

module.exports = Website;