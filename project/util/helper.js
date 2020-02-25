import { https_add } from '../config/const'

const router = require('express').Router();
const Website = require('../models/Website');
const axios = require('axios')

checkWebsiteExists = (website) => {

  return axios
    .get(https_add + '/api/website')
    .then(res => res.data)


}
