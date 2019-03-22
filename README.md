# FORMAVIZ MESSENGER

0. Logging

Before we start we will use a professional logger : `console.log` or `console.error` are synchronous when the destination is a terminal or a file, so they are not suitable for production. To log our application we will use [pino](https://www.npmjs.com/package/pino) lib.

Install pino

```
npm i -S pino pino-pretty
```

Then we will define our logger in `src/logger.js` with a console transport :

```js
const pino = require('pino');

const logger = pino({
  prettyPrint: { colorize: true },
  level: process.env.LEVEL || 'info',
});

module.exports = logger;
```

As you can see, we use an environnement variable `LEVEL` to define the logging level. For development this variable is define in a `.env`.
We use the lib `env-cmd` to load this file for development.

```sh
echo "LEVEL=debug\n" >> .env
npm i -D env-cmd
```

See [npm dev script](package.json#9) to watch how to use it.

1. RabbitMQ

Formaviz messenger use a message broker. We use RABBIT MQ. 

To install client rabbitmq [amqplib](https://www.npmjs.com/package/amqplib) :

```
npm i amqplib
```
this api allows us to connect with rabbitmq server, send a message or again consums this last.


2. Node Server 

In order to use Slack api you need to install Slack client 

For installing Slack client : execute this command line : 

```
npm install @slack/client
```

3. Environment variables configuration 

The .env file contains default values for the environment variables needed by the server.

  * AMQP_URL : Our RabbitMQ server's address 
  
  * AMQP_USER_QUEUE_NAME: userQueue

  * AMQP_TRAINING_QUEUE_NAME : trainingQueue

  * AMQP_EVAL_QUEUE_NAME : evalQueue

  * LEGACY_TOKEN: xoxp-580377679074-581818425606-580266284275-86eb7be84403a45be065fb2cbc4f4cc8



