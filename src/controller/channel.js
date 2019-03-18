const omit = require('lodash.omit');
const logger = require('../logger');
const Answer = require('../model/answer.js');


const createChannel = (datas, param) => {
    if (datas.name == null || param.legacyToken == null) return new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel');
    return web.channels.create({
        name: datas.name,
        token: param.legacyToken
    }).then(channel => {
        logger.info("Channel created");
        return new Answer('CREATE_FORMATION', 'SUCCESS', 'Channel added')
    }
    )
        .catch((err) => {
            return new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel');
        }
        );
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