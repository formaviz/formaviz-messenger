var dotenv = require('dotenv');
dotenv.config({path : '../../.env'});

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_USER_QUEUE_NAME = process.env.AMQP_USER_QUEUE_NAME || 'userQueue';

const amqp = require('amqplib');
const {rpcProducer} = require('../utils/rabbit.js');
const logger = require('../logger');

// create a connection
amqp.connect(AMQP_URL)
    .then((conn) => {
        const data = {
            eventType: 'ADD_USER',
            data: {
                name: 'l3-miage_villeneuve-d',
                idChannel: 'CJ9PCEV7U',
                // email : 'christophe.maingard@davidson.fr',
                email : 'amelie.brilhault@gmail.com'
            }
        };

        conn.createChannel().then((channel) => {
            rpcProducer(conn, channel, AMQP_USER_QUEUE_NAME, data, (msg) => logger.info("RETURN: \n ", msg.content.toString()));
        });
        setTimeout(function() { conn.close(); process.exit(0) }, 1500);
    });