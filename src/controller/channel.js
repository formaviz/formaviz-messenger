const omit = require('lodash.omit');
const logger = require('../logger');
const Answer = require('../model/answer.js');
// require("dotenv").config();
const { WebClient } = require('@slack/client');
const request = require('request');

const createChannel = (datas, param) => {
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null) return Promise.resolve(new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel'));
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

const getChannelsByName = (datas, token) => {
    logger.info("[ GET CHANNEL BY ID ]")
    return new Promise((resolve, reject) => {
        let data = { 'token': token };
        request.get({ 'url': 'https://slack.com/api/conversations.list', 'qs': data, 'json': true },
            (error, response, body) => error ? reject(error) : resolve(body))
    })
        .then(res => {
            if (res.ok == null || res.ok == false) return Promise.reject("Channel not found");
            let channelFilter = res.channels.filter(channel => channel.name == datas.name.toLowerCase());
            if (channelFilter.length == 1) {
                return Promise.resolve(channelFilter[0]);
            }
            return Promise.reject("Channel not found");
        })
}

const getChannelIdByName = (datas, token) => {
    return getChannelsByName(datas, token).then((res) => {
        return res.id
    })
};

const postNote = (datas, param) => {
    logger.info("[ POST NOTE ]")
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null || content.datas.textNote == null) return new Answer('EVAL_FORMATION', 'ERROR', 'Failed to post a note');
    return getChannelIdByName(content.datas, param.legacyToken)
        .then((res) => {
            if (!res || res == null) return Promise.reject("Channel not found");
            return res
        })
        .then(res => {
            let data = { 'token': param.legacyToken, 'channel': res, 'text': content.datas.userName + " a évalué : " + content.datas.textNote }
            request.post({ 'url': 'https://slack.com/api/chat.postMessage', 'qs': data },
                (error, response, body) =>
                    error ? Promise.reject(error) : Promise.resolve(body))
        })
        .then((response) => {
            logger.info("[POST NOTE] result", response);
            return new Answer('Eval_FORMATION', 'SUCCESS', response);
        })
        .catch(err => new Answer('Eval_FORMATION', 'ERROR', err));

};

module.exports = { createChannel, postNote, getChannelIdByName };