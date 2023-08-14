const express = require("express");

const { getProfile } = require("./middleware/getProfile");

const { getContractById, getContracts } = require('./controllers/contracts');
const { getUnpaidJobs, payForJob } = require('./controllers/jobs');

const router = express.Router();

router.get('/contracts/:id',getProfile , getContractById);

router.get('/contracts/', getProfile, getContracts);

router.get('/jobs/unpaid', getProfile, getUnpaidJobs);

router.get('/jobs/:job_id/pay', getProfile, payForJob);

module.exports = router;