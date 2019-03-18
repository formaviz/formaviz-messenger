const express = require('express');
const { addMember, addChannel } = require('../controller/channel');
const logger = require('../logger');

const apiChannel = express.Router();


apiChannel.get('/', (req, res) => {
    logger.info();
    var legacyToken = req.body.token;
    var mail = req.body.mail;
    var name = req.body.name;
    !legacyToken || !mail || !name
        ? res.status(400).send({
            success: false,
            message: 'legacyToken mail and name are required'
        })
        : addMember(legacyToken, mail, name)
            .then(channel => {
                return res.status(201).send({
                    success: true,
                    channel: channel,
                    message: 'add Channel'
                });
            })
            .catch(err => {
                logger.error(`💥 Failed to add channel : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
}
);
module.exports = { apiChannel };