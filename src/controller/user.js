const omit = require('lodash.omit');
const logger = require('../logger');
const Answer = require('../model/answer.js');
const request = require('request');
const { getChannelIdByName } = require('./channel.js');

const inviteUser = (datas, param) => {
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null || content.datas.email == null) return new Answer('ADD_USER', 'ERROR', 'Failed to add the user to the channel');
    return getChannelIdByName(content.datas, param.legacyToken)
        .then((res) => {

            let data = { 'token': param.legacyToken, 'channels': res, 'email': content.datas.email }
            return new Promise((resolve, reject) => {
                request.post({ 'url': 'https://slack.com/api/users.admin.invite', 'qs': data },
                    (error, response, body) =>
                        error ? reject(error) : resolve(body))
            })
        })
        .then((res) => {
            const result = JSON.parse(res);
            if (!result.ok) return new Answer('ADD_USER', 'ERROR', result)
            return new Answer('ADD_USER', 'SUCCESS', result)
        })
        .catch(err => new Answer('ADD_USER', 'ERROR', err));
};

module.exports = { inviteUser };