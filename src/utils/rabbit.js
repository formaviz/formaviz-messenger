const logger = require('../logger');
const uuidv4 = require('uuid/v4');

/**
 * Allows to check if a queues exists
 * @param {*} channel 
 * @param {*} queueName 
 */
const checkQueue = (channel,queueName) => {
    return channel.checkQueue(queueName, function(ok,err){
        if(err != null ) return reject(err); else return resolve(true);  
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
 */
const consume = (channel,queueName,successCallback,rpc,parameter,parameterCallBack) => {
    return checkQueue(channel,queueName)
    .then(() => {
            if(rpc) {
                //allows to process one message at a time
                channel.prefetch(1);
            }
            return channel.consume(queueName, function(msg) {
                logger.info("[CONSUMMER][",queueName,"] waiting consum a message ",msg.content)
                //execute callback
                var result = successCallback(msg,parameterCallBack);
                if(rpc) {
                    // send result to producer
                    channel.sendToQueue(msg.properties.replyTo,
                         Buffer.from(JSON.stringify(result)),{correlationId: msg.properties.correlationId});
                    //allows to infom to channel that the message has been treated
                    channel.ack(msg);
                }
              },parameter);
        })
    .catch((err)=>console.error("[CONSUME-RABBIT](ERR) : \n",err))
}

/**
 * 
 * @param {object} channel 
 * @param {string} queueName 
 * @param {object} message 
 * @param {object} parameter to send a message (for example { correlationId : corr, replyTo : q.queue}) for example
 */
const sender = (channel,queueName,message,parameter) => {
    return new Promise((resolve,reject) => 
        channel.checkQueue(queueName, function(err,ok){
        if(err != null ) return reject(err); else return resolve(true);  
    })
    .then(() => {
            logger.info("[SENDER] send message")
            return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),parameter);
    }))
    .catch((err)=>console.error("don't sent :",err))
}

/**
 * allows to send a message to our api via rpc pattern
 * @param {*} conn 
 * @param {*} channel 
 * @param {*} queueName 
 * @param {*} message 
 * @param {*} successCallback function to apply if the message has been treated and that the consumer has send a message return 
 */
const rpcProducer = (conn,channel,queueName,message,successCallback) => {
    channel.assertQueue('rpc', { exclusive: true }).then(() => {
        // generate an uuid to identify the request
        var corr = uuidv4();
        consume(channel,"rpc",(msg)=>{
            if (msg.properties != null && msg.properties.correlationId == corr) {
                logger.info("[RPC-CONSUMMER] message return with uuid",corr)
                successCallback();
                setTimeout(function() { conn.close(); process.exit(0) }, 500);
            }
        },false,{noAck: true});
        sender(channel,queueName,message,{ correlationId: corr, replyTo: "rpc" });
    });    
}
/**
 * allows to get a message with rpc pattern
 * @param {*} channel 
 * @param {String} queueName 
 * @param {Function} successCallback 
 * @param {Array} parameter for the function callback
 */
const rpcConsumer = (channel,queueName,successCallback,parameterCallBack) => {
    logger.info("[RPC-CONSUMMER][",queueName,"] waiting consum a message ");
    return consume(channel,queueName,successCallback,true,{},parameterCallBack);
}

module.exports = {consume,sender,rpcConsumer,rpcProducer};
