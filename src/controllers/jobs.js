const Models = require('../model');

async function getUnpaidJobs(req, res) {
  const { profile } = req;
  const profileId = profile.id;
  const userCondition = profile.type === 'client' ? 'ClientId' : 'ContractorId';

  try {
    const data = await Models.Job.findAll({
      where: { paid: null },
      include: [{
        model: Models.Contract,
        attributes: [],
        where: {
          status: 'in_progress',
          [userCondition]: profileId,
        },
      }],
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong, Please try again later' });
  }
}

async function payForJob(req, res) {
  let DBTransaction;

  const { profile } = req;
  const jobId = req.params.job_id;
  const profileId = req.profile.id;

  try {
    if (profile.type !== 'client') return res.status(400).json({ message: 'Invalid Request' });

    const jobDetails = await Models.Job.findOne({
      where: { id: jobId },
      include: [{
        attributes: ['ContractorId'],
        model: Models.Contract,
        where: {
          ClientId: profileId,
        },
      }],
    });

    if (!jobDetails) return res.status(400).json({ message: 'Could not found requested job' });

    if (jobDetails.paid) return res.status(400).json({ message: 'You have already paid for this job' });

    if (jobDetails.price > req.profile.balance) return res.status(400).json({ message: 'Insufficient balance in your account, Please deposit money' });

    DBTransaction = await Models.sequelize.transaction({ autocommit: false });

    const contractor = await Models.Profile.findOne({ where: { type: 'contractor', id: jobDetails.Contract.ContractorId } });
    const client = await Models.Profile.findOne({ where: { type: 'client', id: profileId }, lock: true, transaction: DBTransaction });

    const updatedBalanceForClient = profile.balance - jobDetails.price;
    const updatedBalanceForContractor = contractor.balance + jobDetails.price;

    await Models.Profile.update({ balance: updatedBalanceForClient }, { where: { id: client.id }, transaction: DBTransaction });

    await Models.Profile.update({ balance: updatedBalanceForContractor }, { where: { id: contractor.id }, transaction: DBTransaction });

    await Models.Job.update({ paid: true, paymentDate: new Date().toISOString() }, { where: { id: jobId }, transaction: DBTransaction });

    await DBTransaction.commit();

    return res.status(200).send(jobDetails);
  } catch (error) {
    if (DBTransaction) DBTransaction.rollback();

    let message = 'Something went wrong, Please try again later';

    if (error?.parent?.code === 'SQLITE_BUSY') message = 'Request already in-progress, Please try again after sometime.';

    return res.status(500).json({ message });
  }
}

module.exports = { getUnpaidJobs, payForJob };
