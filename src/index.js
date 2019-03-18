const { consume, rpcConsumer } = require('./utils/rabbit.js')

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
    param.token = LEGACY_TOKEN;
    rpcConsumer(channel, AMQP_USER_QUEUE_NAME, (object,object2) => { logger.info("[EXECUTE CALLBACK SUCCESS IN PRODUCTER] Queue : ", AMQP_USER_QUEUE_NAME,"\nLegacy Token :",object2.token); return object; },param);
    rpcConsumer(channel, AMQP_TRAINING_QUEUE_NAME, (object) => { logger.info("[EXECUTE CALLBACK SUCCESS IN PRODUCTER] Queue: ", AMQP_TRAINING_QUEUE_NAME); return object; },param);
    rpcConsumer(channel, AMQP_EVAL_QUEUE_NAME, (object) => { logger.info("[EXECUTE CALLBACK SUCCESS IN PRODUCTER] Queue :", AMQP_EVAL_QUEUE_NAME); return object; },param);
  })
    .catch(function (err) {
      logger.error(`🔥  Failed to start API : ${err.stack}`)
    })
}).catch(function (err) {
  logger.error(`🔥  Failed to start API : ${err.stack}`)
});
