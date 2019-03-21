const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
// const logger = require('../logger');

// create an express Application for our api
const api = express();
api.use(cors());
api.use(hpp());
api.use(helmet());
// api.use(enforce.HTTPS({ trustProtoHeader: true }));

// apply a middelware to parse application/json body
api.use(express.json({ limit: '1mb' }));
// create an express router that will be mount at the root of the api
const apiRoutes = express.Router();
const {apiChannel} = require('../api/channel');

apiRoutes
  // test api
  .get('/', (req, res) =>
      res.status(200).send({message: 'hello from my api'})
  )

    .use('/channels', apiChannel)

  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

// root of our API will be http://localhost:5000/api/v1
api.use('/api/v1', apiRoutes);
module.exports = api;