const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile');


const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models);
app.use(morgan("dev"));

app.use('/api', routes);



module.exports = app;
