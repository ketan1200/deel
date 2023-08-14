const express = require("express");

const { getProfile } = require("./middleware/getProfile");

const { getContractById } = require('./controllers/contracts');

const router = express.Router();

router.get('/contracts/:id',getProfile , getContractById);

module.exports = router;