const express = require('express');
const { addMember, addChannel } = require('../controller/channel');
const logger = require('../logger');

const apiChannel = express.Router();


apiUser.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: 'legacyToken mail and name are required'
    })

})
    .catch(err => {
        logger.error(`💥 Failed to add channel : ${err.stack}`);
        return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
        });
    })


module.exports = { apiChannel };