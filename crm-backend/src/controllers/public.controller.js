const leadService = require('../services/lead.service');

const createEnquiry = async (req, res, next) => {
  try {
    const lead = await leadService.createPublicEnquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! A counselor will contact you soon.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
};
