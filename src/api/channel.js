const express = require('express');
const {getUrl} = require('../controller/channel');
const logger = require('../logger');
const Answer = require('../model/answer.js');

const apiChannel = express.Router();


apiChannel.get('/', (req, res) => {
    logger.info(req.query.training);
    return getUrl(req.query.training)
        .then((result) => res.status(200).send(result))
        .catch(err => res.status(404).send(new Answer('GET URL', 'ERROR', `${err.message}`)))
});
module.exports = { apiChannel };