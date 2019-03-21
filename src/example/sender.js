const amqp = require('amqplib');
const {rpcProducer} = require('../utils/rabbit.js');
const logger = require('../logger');

const AMQP_URL = process.env.AMQP_URL || 'amqp://boowxrlb:L16RP-RTygwePbTrHb1uPOnsPDIPWIiq@bear.rmq.cloudamqp.com/boowxrlb';

// create a connection
amqp.connect(AMQP_URL)
    .then((conn) => {
        const q = 'trainingQueue';
        const t = {
            eventType: 'CREATE_FORMATION',
            data: {
                name: 'Miage_Maubeuge',
                username: 'jean.bon',
                email: 'jean.bon@po.rc',
            }
        };
        conn.createChannel().then((channel) => {
            rpcProducer(conn, channel, q, t, (msg) => logger.info("RETURN: \n ", msg.content.toString()));
        });
        // setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });


// to invite user
// const t = {};
// t.eventType = "CREATE_FORMATION";
// t.datas = {};
// t.datas.name = "blublu2";
// t.datas.token = "user_token";
// t.datas.userName = "Super";
// t.datas.userFistName = "Rabbit";
// // t.datas.email = "superlapin@rabbit.mq";
// // t.datas.email = "cecilia.ouarkoub@hotmail.com";
// t.datas.email = "malik.olivier.etu@univ-lille.fr";
// t.datas.textNote = "basDeGamme 2";
// // sender(channel,q,t,{})