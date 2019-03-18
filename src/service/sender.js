const amqp = require('amqplib');
require("dotenv").config();
const AMQP_URL = process.env.AMQP_URL || 'amqp://boowxrlb:L16RP-RTygwePbTrHb1uPOnsPDIPWIiq@bear.rmq.cloudamqp.com/boowxrlb';
const AMQP_USER_QUEUE_NAME = process.env.USER_QUEUE_NAME || 'userQueue';
const logger = require('../logger');
const { consume, sender, rpcProducer } = require('../utils/rabbit.js')
logger.info(AMQP_URL)

//create a connection
amqp.connect(AMQP_URL)
    .then(function (conn) {
        var q = 'trainingQueue';
        conn.createChannel().then(function (channel) {
            var t = {};
            t.eventType = "CREATE_FORMATION";
            t.datas = {};
            t.datas.name = "Blublu";
            t.datas.token = "user_token";
            // sender(channel,q,t,{})
            rpcProducer(conn, channel, q, t, (msg) => logger.info("SUCCESSFUL RETURN: \n ", msg.content.toString()));

        });
        // setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
