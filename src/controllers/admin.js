const Models = require('../model');
const Op = Models.Op;

async function bestContractors(req, res) {

  try {

    if (!req.query.start_date || !req.query.end_date) return res.status(400).json({ message: 'Invalid Requested date' });

    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    const jobs = await Models.Job.findAll({
      attributes: [[Models.sequelize.fn('sum', Models.sequelize.col('price')), 'totalPrice'], "profession"],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] }
      },
      include: [{
        attributes: [],
        model: Models.Contract,
        include: [{
          attributes: [],
          model: Models.Profile,
        }],
      }],
      group: ['profession'],
      order: [[Models.sequelize.fn('sum', Models.sequelize.col('totalPrice')), 'DESC']]
    });

    if (!jobs) return res.status(200).json({ total_income: 0 });

    const contractorDetails = await Models.Profile.findOne({
      where: {
        id: jobs['Contract.ContractorId']
      },
      raw: true,
    });

    return res.status(200).json({ ...contractorDetails, total_income: jobs.total_income });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong, Please try again later' });
  }

}

async function bestClients(req, res) {

  try {

    if (req.body.start_date || req.body.end_date) return res.status(400).json({ message: 'Invalid Requested date' });

    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    const limit = req.query.limit || 2;

    console.log(startDate, endDate);

    const jobs = await Models.Job.findAll({
      as: 'Job',
      attributes: [[Models.sequelize.fn('sum', Models.sequelize.col('price')), 'paid'], "Contract.Client.id", [Models.sequelize.literal("firstName || ' ' || lastName"), 'fullName']],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] }
      },
      include: [{
        attributes: [],
        model: Models.Contract,
        include: [{
          model: Models.Profile,
          as: 'Client',
          attributes: []
        }],
      }],
      raw: true,
      group: ['Contract.clientId'],
      order: [[Models.sequelize.fn('sum', Models.sequelize.col('price')), 'DESC']],
      limit
    });

    return res.status(200).json(jobs);

  } catch (err) {

    return res.status(500).json({ message: 'Something went wrong, Please try again later' });
  }
}

module.exports = { bestContractors, bestClients };