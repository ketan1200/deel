const express = require('express');

const { getProfile } = require('./middleware/getProfile');

const { getContractById, getContracts } = require('./controllers/contracts');
const { getUnpaidJobs, payForJob } = require('./controllers/jobs');
const { addBalance } = require('./controllers/balance');
const { bestClients, bestProfession } = require('./controllers/admin');

const router = express.Router();

router.get('/contracts/:id', getProfile, getContractById);

router.get('/contracts/', getProfile, getContracts);

router.get('/jobs/unpaid', getProfile, getUnpaidJobs);

router.get('/jobs/:job_id/pay', getProfile, payForJob);

router.post('/balances/deposit/:userId', getProfile, addBalance);

router.get('/admin/best-profession', bestProfession);

router.get('/admin/best-clients', bestClients);

module.exports = router;
