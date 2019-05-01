var dotenv = require('dotenv');
dotenv.config({path : '../../.env'});

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_TRAINING_QUEUE_NAME = process.env.AMQP_TRAINING_QUEUE_NAME || 'trainingQueue';

const amqp = require('amqplib');
const {rpcProducer} = require('../utils/rabbit.js');
const logger = require('../logger');

// create a connection
amqp.connect(AMQP_URL)
    .then((conn) => {
        const data = {
            eventType: 'CREATE_FORMATION',
            data: {
                name: 'superlapinou'
            }
        };

        conn.createChannel().then((channel) => {
            rpcProducer(conn, channel, AMQP_TRAINING_QUEUE_NAME, data, (msg) => logger.info("RETURN: \n ", msg.content.toString()));
        });
        setTimeout(function() { conn.close(); process.exit(0) }, 1500);
    });