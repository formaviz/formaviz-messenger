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


const getChannelIdByName = (datas, token) => {
    return new Promise((resolve, reject) => {
        let data = {'token' : token};
        logger.info(data)
        request.get({'url':'https://slack.com/api/conversations.list','qs':data,'json':true},
            (error, response, body) => error ? reject(error) : resolve(body))})

        .then(res => {
            // logger.logger(res.channels);
            let channelFilter = res.channels.filter(channel =>  channel.name == datas.name.toLowerCase());
            if (channelFilter.length == 1) {        
                return Promise.resolve(channelFilter[0].id);
            }
            return Promise.resolve(false);
        })
};

const postNote = (datas, param) => {
    logger.info(datas)
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null || content.datas.textNote == null) return new Answer('EVAL_FORMATION', 'ERROR', 'Failed to post a note');
    return getChannelIdByName(content.datas, param.legacyToken)
        .then((res) =>{
            // logger.info(res)
            if(!res || res ==null) return Promise.reject("Channel not found");
            return res
        })
        .then(res => {
            let data = {'token' : param.legacyToken,'channel':res,'text':content.datas.userName + " a évalué : "+content.datas.textNote}
            request.post({'url':'https://slack.com/api/chat.postMessage','qs':data},
            (error, response, body) =>
                error ? Promise.reject(error) : Promise.resolve(body))
        })
        .then((response)=>{
            logger.info("[POST NOTE] result",response);
            return new Answer('Eval_FORMATION', 'SUCCESS', response);
        })
        .catch(err =>  new Answer('Eval_FORMATION', 'ERROR', err));
    
};

module.exports = { createChannel,postNote };