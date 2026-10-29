const leadService = require('../services/lead.service');

const getPublic = async (req, res, next) => {
  try {
    const result = await leadService.getPublicLeads(req.query);
    res.status(200).json({
      success: true,
      data: result.leads,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getMy = async (req, res, next) => {
  try {
    const result = await leadService.getMyLeads(req.user._id, req.query);
    res.status(200).json({
      success: true,
      data: result.leads,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const claim = async (req, res, next) => {
  try {
    const lead = await leadService.claimLead(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Lead claimed successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const lead = await leadService.updateLeadStatus(req.params.id, req.user._id, req.body.status);
    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await leadService.getDashboardStats(req.user._id);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublic,
  getMy,
  claim,
  updateStatus,
  getById,
  getStats,
};
