const uuidv4 = require('uuid/v4');
const logger = require('../logger');

/**
 * Allows to check if a queues exists
 * @param {*} channel
 * @param {*} queueName
 */
const checkQueue = (channel, queueName) => {
    return channel.checkQueue(queueName, (ok, err) => {
        return err != null ? Promise.reject(err) : Promise.resolve(true);
    });
};

/**
 *
 * alllow to get a message and do an action.
 * @param {*} channel
 * @param {*} queueName
 * @param {Function} successCallback function which return an object
 * @param {boolean} rpc
 * @param {*} parameter {noAck: true} for example it's parameters RABBITMQ
 * @param token
 */
const consume = (channel, queueName, successCallback, rpc, parameter, token) => {
    logger.info("[consume] begin")
    return checkQueue(channel, queueName)
        .then(() => {
            if (rpc) {
                // allows to process one message at a time
                channel.prefetch(1);
            }
            return channel.consume(queueName, (msg) => {
                logger.info("[CONSUMMER][", queueName, "] waiting consum a message ", msg.content.toString());
                // execute callback
                const result = successCallback(msg, token);

                if (rpc) {
                    logger.debug("IN RPC",result)
                    result.then((res) => {
                        
                        // send result to producer
                        channel.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(res)), {correlationId: msg.properties.correlationId});
                        // allows to infom to channel that the message has been treated
                        channel.ack(msg);
                    });
                }
            }, parameter);
        })
        .catch((err) => logger.error("[CONSUME-RABBIT](ERR) : \n", err))
};

/**
 *
 * @param {object} channel
 * @param {string} queueName
 * @param {object} message
 * @param {object} parameter to send a message (for example { correlationId : corr, replyTo : q.queue}) for example
 */
const sender = (channel, queueName, message, parameter) => {
    return new Promise((resolve, reject) =>
        channel.checkQueue(queueName, (err) => {
            return err != null ? reject(err) : resolve(true);
        })
            .then(() => {
                logger.debug("[SENDER] send message");
                return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), parameter);
            }))
        .catch((err) => logger.error("don't sent :", err))
};

/**
 * allows to send a message to our api via rpc pattern
 * @param {*} conn
 * @param {*} channel
 * @param {*} queueName
 * @param {*} message
 * @param {*} successCallback function to apply if the message has been treated and that the consumer has send a message return
 */
const rpcProducer = (conn, channel, queueName, message, successCallback) => {
    channel.assertQueue('rpcQueue', {}).then(() => {
        // generate an uuid to identify the request
        const corr = uuidv4();
        consume(channel, "rpcQueue", (msg) => {
            if (msg.properties != null && msg.properties.correlationId === corr) {
                logger.debug("[RPC-CONSUMMER] message return with uuid", corr);
                successCallback(msg);
                setTimeout(() => {
                    conn.close();
                    process.exit(0)
                }, 100);
            }
        }, false, { noAck: true });
        sender(channel, queueName, message, { correlationId: corr, replyTo: "rpcQueue" });
    });
};
/**
 * allows to get a message with rpc pattern
 * @param {*} channel
 * @param {String} queueName
 * @param {Function} successCallback
 * @param {String} token for the function callback
 */
const rpcConsumer = (channel, queueName, successCallback, token) => {
    logger.info("[RPC-CONSUMMER][", queueName, "] waiting consum a message ");
    return consume(channel, queueName, successCallback, true, {}, token);
};

module.exports = { consume, sender, rpcConsumer, rpcProducer };
