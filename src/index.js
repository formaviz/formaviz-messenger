const amqp = require('amqplib');
const logger = require('./logger');
require("dotenv").config();

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
logger.info(process.env.AMQP_URL)
// connect to rabbitmq 
amqp.connect(AMQP_URL).then(function(conn){
  logger.info("ouuii");
  return;
}).catch(function(err) {
  logger.error(`🔥  Failed to start API : ${err.stack}`)
});