const express = require('express');
const { addMember, addChannel } = require('../controller/channel');
const logger = require('../logger');

const apiChannel = express.Router();

apiChannel.post('/', (req, res) => {
    logger.info();
    var legacyToken = req.body.token;
    var name = req.body.name;
    !legacyToken || !name
        ? res.status(400).send({
            success: false,
            message: 'legacyToken and channel name are required'
        })
        : addChannel(legacyToken, name)
            .then(channel => {
                return new Answer("addChannel", "OK", "The channel has been created");
            });
})
    .catch(err => {
        logger.error(`💥 Failed to add channel : ${err.stack}`);
        return new Answer("addChannel", "KO", "The channel has not been created");
    })



apiChannel.post('/', (req, res) => {
    logger.info();
    var legacyToken = req.body.token;
    var mail = req.body.mail;
    var name = req.body.name;
    !legacyToken || !mail || !name
        ? res.status(400).send({
            success: false,
            message: 'legacyToken mail and name are required'
        })
        : addChannel(legacyToken, mail, name)
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