const omit = require('lodash.omit');
const logger = require('../logger');
const Answer = require('../model/answer.js');
// require("dotenv").config();
const { WebClient } = require('@slack/client');
const fetch = require('whatwg-fetch');
require('url-search-params-polyfill');

// const { createFetch, base, accept, parse, params,method } = require('http-client');
// const fetchInit = createFetch(
//     base('https://slack.com/api/'),  // Prefix all request URLs
//     accept('application/json'),         // Set "Accept: application/json" in the request headers
//     parse('json')                       // Read the response as JSON and put it in response.body
//   )

const createChannel = (datas, param) => {
    let content = JSON.parse(datas.content.toString());
<<<<<<< HEAD
    if (content.datas == null || content.datas.name == null || param.legacyToken == null) return new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel');
=======
    if (content.datas == null || content.datas.name == null || param.legacyToken == null) return Promise.resolve(new Answer('CREATE_FORMATION', 'ERROR', 'Failed to add Channel'));
>>>>>>> c0736e00f7e98fcf69f90567002ce46d2a8c5a08
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


<<<<<<< HEAD
/* 
const postNote = (datas) => {
    web.chat.postMessage({
        name: datas.name,
        token: datas.token
    });
    console.log('Message posted !');
}
*/
=======
const getChannelIdByName = (datas, web) => {
    return new Promise((resolve, reject) => {
        web.channels.list({}, (err, res) => {
            if (err) {
                return resolve(false);
            }
            let channelFilter = res.channels.filter(channel => channel.name_normalized == datas.name.toLowerCase())
            logger.info("TITI :",channelFilter[0].id)
            logger.info("TOTO :",datas.name)
            if (channelFilter.length == 1) {            
                return resolve(channelFilter[0].id);
            }
            return resolve(false);
        })
    });

};

const postNote = (datas, param) => {
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null || content.datas.textNote == null) return new Answer('EVAL_FORMATION', 'ERROR', 'Failed to post a note');
    let web = new WebClient(param.legacyToken); 
    // logger.info("GETCHANNELID",getChannelIdByName(content.datas, web))   
    return getChannelIdByName(content.datas, web).then((res) =>{
        logger.info("OUIIII",res)
        if(!res || res ==null) return new Answer('Eval_FORMATION', 'ERROR', "non")
        let data = {'token' : param.legacyToken,'channel':res,'text':content.datas.userName + " a évalué : "+content.datas.textNote}
        logger.info(fetch)
        fetch('https://slack.com/api/chat.postMessage', {
            searchParams : data,
            method: 'POST' // 'GET', 'PUT', 'DELETE', etc.
          })
          .then(response => response.json())
        // createFetch(
        //     'chat.postMessage', 
        //      method('POST'),
        //      params({'token' : param.legacyToken,'channel':res,'text':content.datas.userName + " a évalué : "+content.datas.textNote})
        // ).fetch().then((response)=> {
        //     logger.info(response)
        // })
    }).catch(err => logger.info(err));
        // .then((res) => {
        //     logger.info("isChannelExists : ")
        // })
        // .catch((err) => {
        //     logger.info("Post note failed", err);
        //     return new Answer('Eval_FORMATION', 'ERROR', err);
        // });
};


>>>>>>> c0736e00f7e98fcf69f90567002ce46d2a8c5a08

module.exports = { createChannel,postNote };