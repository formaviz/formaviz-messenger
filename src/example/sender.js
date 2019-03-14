const amqp = require('amqplib');
const logger = require('../logger');
const {rpcProducer} = require('../utils/rabbit.js')
require("dotenv").config({ path: '../../.env' });
const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_USER_QUEUE_NAME = process.env.AMQP_USER_QUEUE_NAME || 'userQueue';

//create a connection
amqp.connect(AMQP_URL)
    .then(function(conn){
        logger.info(process.env.AMQP_USER_QUEUE_NAME)
        conn.createChannel().then(function(channel){
            var t = {};
            t.test = "test2";
            rpcProducer(conn,channel,AMQP_USER_QUEUE_NAME,t,()=>logger.info("SUCCESSFUL RETURN"));
        });
});
