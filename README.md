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

2. Routing RABBITMQ

3. Routing