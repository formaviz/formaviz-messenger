const amqp = require('amqplib');
require("dotenv").config();
const AMQP_URL = process.env.AMQP_URL || 'amqp://boowxrlb:L16RP-RTygwePbTrHb1uPOnsPDIPWIiq@bear.rmq.cloudamqp.com/boowxrlb';
const AMQP_USER_QUEUE_NAME = process.env.USER_QUEUE_NAME || 'userQueue';
const logger = require('../logger');
const { consume, sender, rpcProducer } = require('../utils/rabbit.js')

//create a connection
amqp.connect(AMQP_URL)
    .then(function (conn) {
        var q = 'userQueue';
        conn.createChannel().then(function (channel) {
            var t = {};
            t.eventType = "CREATE_FORMATION";
            t.datas = {};
            t.datas.name = "blublu";
            t.datas.token = "user_token";
            t.datas.userName = "Super";
            t.datas.userFistName = "Rabbit";
            // t.datas.email = "superlapin@rabbit.mq";
            t.datas.email = "cecilia.ouarkoub@hotmail.com";
            t.datas.textNote = "basDeGamme 2";
            // sender(channel,q,t,{})
            rpcProducer(conn, channel, q, t, (msg) => logger.info("SUCCESSFUL RETURN: \n ", msg.content.toString()));

        });
        // setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });