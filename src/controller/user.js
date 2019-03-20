const omit = require('lodash.omit');
const logger = require('../logger');
const Answer = require('../model/answer.js');
// require("dotenv").config();
const request = require('request');


const getChannelIdByName = (datas, token) => {
    return new Promise((resolve, reject) => {
        let data = { 'token': token };
        logger.info(data)
        request.get({ 'url': 'https://slack.com/api/conversations.list', 'qs': data, 'json': true },
            (error, response, body) => error ? reject(error) : resolve(body))
    })

        .then(res => {
            // logger.logger(res.channels);
            let channelFilter = res.channels.filter(channel => channel.name == datas.name.toLowerCase());
            if (channelFilter.length == 1) {
                return Promise.resolve(channelFilter[0].id);
            }
            return Promise.resolve(false);
        })
};


const isMember = (datas, token) => {
    return getChannelIdByName(datas, token)
        .then((res) => {
            if (!res || res == null) return Promise.reject("Channel not found");
            return res
        })
        .then(res => {
            let data = { 'token': token, 'channel': res }
            request.get({ 'url': 'https://slack.com/api/conversations.info', 'qs': data, 'json': true },
                (error, response, body) =>
                    error ? Promise.reject(error) : Promise.resolve(body))
        })
        .then((res) => {
            //logger.info('FERIEEEL :', res)
            let memberFilter = res.channels.filter(member => member.is_member == true);
            if (memberFilter.length != 1) {
                return Promise.resolve(memberFilter[0].is_member);
            }
            return Promise.resolve(false);

        })
};



const inviteUser = (datas, param) => {
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null || content.datas.email == null) return new Answer('ADD_USER', 'ERROR', 'Failed to add the user to the channel');
    return isMember(content.datas, param.legacyToken)
        .then((res) => {
            if (!res) return Promise.reject("User already invited to this channel");
            return res
        })
        .then(res => {
            let data = { 'token': param.legacyToken, 'channel': res, 'text': content.datas.userName + " a évalué : " + content.datas.textNote }
            request.post({ 'url': 'https://slack.com/api/users.admin.invite', 'qs': data },
                (error, response, body) =>
                    error ? Promise.reject(error) : Promise.resolve(body))
        })
        .then((response) => {
            logger.info("[INVITE USER] result", response);
            return new Answer('ADD_USER', 'SUCCESS', response);
        })
        .catch(err => new Answer('ADD_USER', 'ERROR', err));

};

module.exports = { inviteUser };
