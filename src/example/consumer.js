const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((errChannel, ch) => {
        const q = 'hello';
    ch.assertQueue(q, { durable: false });
        ch.consume(q, () => {
            // console.log(" [x] Received %s", msg.content.toString());
    }, { noAck: true });
  });
});