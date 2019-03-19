const omit = require('lodash.omit');
const logger = require('../logger');
const Answer = require('../model/answer.js');
// require("dotenv").config();
const { WebClient } = require('@slack/client');


const createChannel = (datas, param) => {
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null) return new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel');
    let web = new WebClient(param.legacyToken);
    return web.channels.create({
        name: content.datas.name
    }).then((response) => {
        logger.info("Channel created");
        return new Answer('CREATE_FORMATION', 'SUCCESS', 'Channel added')
    })
        .catch((err) => {
            logger.info("Channel fail", err);
            return new Answer('CREATE_FORMATION', 'ERROR', err);
        });
};


/* 
const postNote = (datas) => {
    web.chat.postMessage({
        name: datas.name,
        token: datas.token
    });
    console.log('Message posted !');
}
*/

module.exports = { createChannel };