const express = require("express");

const { getProfile } = require("./middleware/getProfile");

const { getContractById, getContracts } = require('./controllers/contracts');

const router = express.Router();

router.get('/contracts/:id',getProfile , getContractById);

router.get('/contracts/', getProfile, getContracts);

module.exports = router;