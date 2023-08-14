const Models = require('../model');

async function getUnpaidJobs(req, res) {

  const profile = req.profile;
  const profileId = profile.id
  const userCondition = profile.type === 'client' ? 'ClientId' : 'ContractorId';

  try {
    const data = await Models.Job.findAll({
      where: { paid: null },
      include: [{
        model: Models.Contract,
        attributes: [],
        where: {
          status: "in_progress",
          [userCondition]: profileId
        }
      }]
    });
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong, Please try again later' });
  }

}


module.exports = { getUnpaidJobs };