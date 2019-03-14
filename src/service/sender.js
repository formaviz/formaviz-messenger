const amqp = require('amqplib/callback_api');

//create a connection
amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'hello';
        //create a queue (structure to stock message)
        ch.assertQueue(q, {durable: false});
        // send a message to a queue
        ch.sendToQueue(q, Buffer.from('Hello World!'));
        console.log(" [x] Sent 'Hello World!'");
    });
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

