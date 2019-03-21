const request = require('request');
const Answer = require('../model/answer.js');
const { getChannelIdByName } = require('./channel.js');

const inviteUser = (params, param) => {
    const content = JSON.parse(params.content.toString());
    if (content.data == null || content.data.name == null || param.legacyToken == null || content.data.email == null) return new Answer('ADD_USER', 'ERROR', 'Failed to add the user to the channel');
    return getChannelIdByName(content.data, param.legacyToken)
        .then((res) =>{

            const data = {'token': param.legacyToken, 'channels': res, 'email': content.data.email};
            return new Promise((resolve,reject) => {
                request.post({ 'url': 'https://slack.com/api/users.admin.invite', 'qs': data },
                (error, response, body) =>
                    error ? reject(error) : resolve(body))
            }) 
        })
        .then((res)=>{
            const result = JSON.parse(res);
            if (!result.ok) return new Answer('ADD_USER', 'ERROR', result);
            return new Answer('ADD_USER', 'SUCCESS', result)
        })
            .catch(err => new Answer('ADD_USER', 'ERROR', err.message));
};

module.exports = { inviteUser };
