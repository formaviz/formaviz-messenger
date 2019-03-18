const amqp = require('amqplib');
require("dotenv").config();
const AMQP_URL = process.env.AMQP_URL || 'amqp://boowxrlb:L16RP-RTygwePbTrHb1uPOnsPDIPWIiq@bear.rmq.cloudamqp.com/boowxrlb';
const AMQP_USER_QUEUE_NAME = process.env.USER_QUEUE_NAME || 'userQueue';
const logger = require('../logger');
const {consume,sender,rpcProducer} = require('../utils/rabbit.js')
logger.info(AMQP_URL)

//create a connection
amqp.connect(AMQP_URL)
    .then(function(conn){
        logger.info("[SENDER] send a message")
        var q = 'userQueue';
        conn.createChannel().then(function(channel){
            var t = {};
            t.test = "test2";
            // sender(channel,q,t,{})
            rpcProducer(conn,channel,q,t,()=>logger.info("SUCCESSFUL RETURN"));

        });
    // setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
