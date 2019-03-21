const {WebClient} = require('@slack/client');
const request = require('request');
const logger = require('../logger');
const Answer = require('../model/answer.js');

const createChannel = (params, param) => {
    const content = JSON.parse(params.content.toString());
    if (content.data == null || content.data.name == null || param.legacyToken == null) return Promise.resolve(new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel'));
    const web = new WebClient(param.legacyToken);
    return web.channels.create({
        name: content.data.name
    }).then(() => {
        logger.info("Channel created");
        return new Answer('CREATE_FORMATION', 'SUCCESS', 'Channel added')
    })
        .catch((err) => {
            logger.info("Channel fail", err);
            return new Answer('CREATE_FORMATION', 'ERROR', err);
        });
};

const getChannelsByName = (params, token) => {
    logger.info("[ GET CHANNEL BY ID ]");
    return new Promise((resolve, reject) => {
        const data = {'token': token};
        request.get({'url': 'https://slack.com/api/conversations.list', 'qs': data, 'json': true},
            (error, response, body) => error ? reject(new Error(error)) : resolve(body))
    })
        .then(res => {
            if (res.ok == null || res.ok === false) return Promise.reject(new Error("Channel not found"));
            const channelFilter = res.channels.filter(channel => channel.name === params.name.toLowerCase());
            if (channelFilter.length === 1) {
                return Promise.resolve(channelFilter[0]);
            }
            return Promise.reject(new Error("Channel not found"));
        })
};

const getChannelIdByName = (params, token) => {
    return getChannelsByName(params, token).then((res) => {
        return res.id
    })
        .catch(err => {
            return Promise.reject(new Error(err.message))
        })
};

const postNote = (params, param) => {
    logger.info("[ POST NOTE ]");
    const content = JSON.parse(params.content.toString());
    if (content.data == null || content.data.name == null || param.legacyToken == null || content.data.textNote == null) return new Answer('EVAL_FORMATION', 'ERROR', 'Failed to post a note');
    return getChannelIdByName(content.data, param.legacyToken)
        .then((res) => {
            if (!res) return Promise.reject(new Error("Channel not found"));
            return res
        })
        .then(res => {
            const data = {
                'token': param.legacyToken,
                'channel': res,
                'text': `${content.data.userName  } a évalué : ${  content.data.textNote}`
            };
            request.post({'url': 'https://slack.com/api/chat.postMessage', 'qs': data},
                (error, response, body) =>
                    error ? Promise.reject(new Error(error)) : Promise.resolve(body))
        })
        .then((response) => {
            return new Answer('Eval_FORMATION', 'SUCCESS', response);
        })
        .catch(err => {
            return new Answer('Eval_FORMATION', 'ERROR', err.message)
        });

};

const getUrl = (name) => {
    const legacyToken = process.env.LEGACY_TOKEN;
    if (name == null || legacyToken == null) return Promise.reject(new Error(`Failed to get URL for the training`));
    return getChannelIdByName({"name": name}, legacyToken)
        .then((res) => {
            if (!res) return Promise.reject(new Error("Channel not found"));
            return Promise.resolve(new Answer('GET URL', 'SUCCESS', `https://slack.com/app_redirect?channel=${res}`));
        })
        .catch(err => {
            return Promise.reject(new Error(err.message))
        });
};

module.exports = {createChannel, postNote, getChannelIdByName, getUrl};