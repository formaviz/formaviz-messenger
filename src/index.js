const { consume, rpcConsumer } = require('./utils/rabbit.js')
const { createChannel, postNote } = require('./controller/channel.js');
const { inviteUser } = require('./controller/user.js');
const amqp = require('amqplib');
const logger = require('./logger');
require("dotenv").config();
const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_USER_QUEUE_NAME = process.env.AMQP_USER_QUEUE_NAME || 'userQueue';
const AMQP_TRAINING_QUEUE_NAME = process.env.AMQP_TRAINING_QUEUE_NAME || 'trainingQueue';
const AMQP_EVAL_QUEUE_NAME = process.env.AMQP_EVAL_QUEUE_NAME || 'evalQueue';
const LEGACY_TOKEN = process.env.LEGACY_TOKEN || 'JESUS IS BACK';
const api = require('./api');


// connect to rabbitmq 

amqp.connect(AMQP_URL).then(function (conn) {
  api.listen(process.env.PORT, '0.0.0.0', err =>
    err
      ? logger.error(`🔥  Failed to start API : ${err.stack}`)
      : logger.info(`🌎  API is listening on port`)
  );
  conn.createChannel().then(function (channel) {

    const param = {};
    param.legacyToken = LEGACY_TOKEN;
    rpcConsumer(channel, AMQP_USER_QUEUE_NAME, inviteUser, param);
    rpcConsumer(channel, AMQP_TRAINING_QUEUE_NAME, createChannel, param);
    rpcConsumer(channel, AMQP_EVAL_QUEUE_NAME, postNote, param);

  })
    .catch(function (err) {
      logger.error(`🔥  Failed to start API : ${err.stack}`)
    })
}).catch(function (err) {
  logger.error(`🔥  Failed to start API : ${err.stack}`)
});
