const {consume,rpcConsumer} = require('./utils/rabbit.js')

const amqp = require('amqplib');
const logger = require('./logger');
require("dotenv").config();
const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_USER_QUEUE_NAME = process.env.AMQP_USER_QUEUE_NAME || 'userQueue';
const AMQP_TRAINING_QUEUE_NAME = process.env.AMQP_TRAINING_QUEUE_NAME || 'trainingQueue';
const AMQP_EVAL_QUEUE_NAME = process.env.AMQP_EVAL_QUEUE_NAME || 'evalQueue';
const api = require('./api');

// connect to rabbitmq 

amqp.connect(AMQP_URL).then(function(conn){
  api.listen(8080, '0.0.0.0', err =>
    err
      ? logger.error(`🔥  Failed to start API : ${err.stack}`)
      : logger.info(`🌎  API is listening on port`)
  );
  conn.createChannel().then(function(channel) {
    rpcConsumer(channel,AMQP_USER_QUEUE_NAME,(object)=>{logger.info("[EXECUTE CALLBACK SUCCESS IN PRODUCTER] Queue : ",AMQP_USER_QUEUE_NAME);return object;});
    rpcConsumer(channel,AMQP_TRAINING_QUEUE_NAME,(object)=>{logger.info("[EXECUTE CALLBACK SUCCESS IN PRODUCTER] Queue: ",AMQP_TRAINING_QUEUE_NAME);return object;});
    rpcConsumer(channel,AMQP_EVAL_QUEUE_NAME,(object)=>{logger.info("[EXECUTE CALLBACK SUCCESS IN PRODUCTER] Queue :",AMQP_EVAL_QUEUE_NAME);return object;});
  })
  .catch(function(err) {
    logger.error(`🔥  Failed to start API : ${err.stack}`)
  })
}).catch(function(err) {
  logger.error(`🔥  Failed to start API : ${err.stack}`)
});
