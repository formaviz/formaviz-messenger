const omit = require('lodash.omit');
const logger = require('../logger');

const createChannel = (datas, legacy_token) => {
    if (datas.name == null) return new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel');
    return web.channels.create({
        name: datas.name,
        token: legacy_token
    }).then(channel => {
        logger.info("Channel created");
        return new Answer('CREATE_FORMATION', 'SUCCESS', 'Channel added')
    }
    )
        .catch((err) => {
            return new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel');
        }
        );
}



function postNote(datas) {
    web.chat.postMessage({

        name: datas.name,
        token: datas.token

    });
    console.log('Message posted !');

}

export { createChannel, postNot };