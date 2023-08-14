const Models = require('../model');
const Op = Models.Op;

async function getContractById(req, res) {

  const profileId = req.profile.id;

  const { id: contractId } = req.params;

  try {

    const contract = await Models.Contract.findOne({ where: { id: contractId, clientId: profileId } });

    if (!contract) return res.status(404).json({ message: "Invalid Contractor id" });

    return res.json(contract);

  } catch (error) {

    return res.status(500).send({ message: 'Something went wrong, Please try again later' });

  }
};


async function getContracts(req, res) {

  const profileId = req.profile.id;

  try {

    const contract = await Models.Contract.findAll({ where: { clientId: profileId, status: { [Op.ne]: 'terminated' } } });

    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    return res.json(contract);

  } catch (error) {

    return res.status(500).send({ message: 'Something went wrong, Please try again later' });

  }

}

module.exports = { getContractById, getContracts };