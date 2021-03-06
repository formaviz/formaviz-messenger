const amqp = require('amqplib');
const {inviteUser} = require('./controller/user.js');
const {rpcConsumer} = require('./utils/rabbit.js');
const { createChannel, postNote } = require('./controller/channel.js');

require("dotenv").config();

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_USER_QUEUE_NAME = process.env.AMQP_USER_QUEUE_NAME || 'userQueue';
const AMQP_TRAINING_QUEUE_NAME = process.env.AMQP_TRAINING_QUEUE_NAME || 'trainingQueue';
const AMQP_EVAL_QUEUE_NAME = process.env.AMQP_EVAL_QUEUE_NAME || 'evalQueue';
const LEGACY_TOKEN = process.env.LEGACY_TOKEN || 'JESUS IS BACK';
const api = require('./api');
const logger = require('./logger');



// connect to rabbitmq 

amqp.connect(AMQP_URL).then((conn) => {
  api.listen(process.env.PORT, '0.0.0.0', err =>
    err
      ? logger.error(`🔥  Failed to start API : ${err.stack}`)
      : logger.info(`🌎  API is listening on port`)
  );
    conn.createChannel().then((channel) => {
    rpcConsumer(channel, AMQP_USER_QUEUE_NAME, inviteUser, LEGACY_TOKEN);
    rpcConsumer(channel, AMQP_TRAINING_QUEUE_NAME, createChannel, LEGACY_TOKEN);
    rpcConsumer(channel, AMQP_EVAL_QUEUE_NAME, postNote, LEGACY_TOKEN);
  })
}).catch(err => logger.error(`🔥  Failed to start API : ${err.stack}`));
