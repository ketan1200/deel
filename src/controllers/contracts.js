const Models = require('../model');

async function getContractById(req, res) {

    const profileId = req.profile.id;
  
    const { id: contractId } = req.params;
  
    try {

        console.log(profileId, contractId);
  
      const contract = await Models.Contract.findOne({ where: { id: contractId, clientId: profileId } });
  
      if (!contract) return res.status(404).json({ message: "Invalid Contractor id" });
  
      return res.json(contract);
  
    } catch (error) {

        console.log('error', error);
  
      return res.status(500).send({ message: 'Something went wrong, Please try again later' });
  
    }
  };

module.exports = { getContractById };