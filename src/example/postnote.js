var dotenv = require('dotenv');
dotenv.config({path : '../../.env'});

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_EVAL_QUEUE_NAME = process.env.AMQP_EVAL_QUEUE_NAME || 'evalQueue';

const amqp = require('amqplib');
const {rpcProducer} = require('../utils/rabbit.js');
const logger = require('../logger');
// create a connection
amqp.connect(AMQP_URL)
    .then((conn) => {
        const t = {
            eventType: 'EVAL_FORMATION ',
            data: {
                name: 'dut-info_lens',
                // name: 'superlapinou',
                // username: 'Lapin Crétin',
                email: 'lapin.cretin@po.rc',
                textNote: 'Bad de gamme',
                idChannel : 'CJD1STM4H'
            }
        };
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
        conn.createChannel().then((channel) => {
            rpcProducer(conn, channel, AMQP_EVAL_QUEUE_NAME, t, (msg) => logger.info("RETURN: \n ", msg.content.toString()));
        });
        setTimeout(function() { conn.close(); process.exit(0) }, 1500);
    });


