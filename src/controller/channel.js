const omit = require('lodash.omit');
const logger = require('../logger');


const createChannel = (datas) => {
    return web.channels.create({
        name: datas.name,
        token: datas.token
    }).then(channel => {
        logger.info("Channel created");
        return omit(
            channel.get({
                plain: true
            }
            )
        )
    }
    );
}
const addMember = (datas) => {
    web.channels.invite({
        name: datas.name,
        token: datas.token
    }).then(channel => {
        logger.info("Member added");
        return omit(
            channel.get({
                plain: true
            }
            )
        )
    });

}

export { createChannel, addMember };