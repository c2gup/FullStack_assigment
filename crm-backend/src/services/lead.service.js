const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const { notFound, conflict, forbidden, badRequest } = require('../utils/errors');

const createPublicEnquiry = async (leadData) => {
  // Enforce security: strictly ignore any incoming assignment or privileged fields
  const safeData = {
    name: leadData.name.trim(),
    email: leadData.email.toLowerCase().trim(),
    phone: leadData.phone.trim(),
    courseInterest: leadData.courseInterest.trim(),
    city: (leadData.city || '').trim(),
    message: (leadData.message || '').trim(),
    status: 'NEW',
    assignedTo: null,
  };

  const newLead = await Lead.create(safeData);
  return newLead.toJSON();
};

const getPublicLeads = async ({ page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' }) => {
  const query = { assignedTo: null };

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { courseInterest: searchRegex },
      { city: searchRegex },
    ];
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  const total = await Lead.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;

  const leads = await Lead.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const getMyLeads = async (counselorId, { page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', order = 'desc' }) => {
  const query = { assignedTo: counselorId };

  if (status && ['NEW', 'CONTACTED', 'CONVERTED'].includes(status)) {
    query.status = status;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { courseInterest: searchRegex },
      { city: searchRegex },
    ];
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  const total = await Lead.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;

  const leads = await Lead.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const claimLead = async (leadId, counselorId) => {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw badRequest('Invalid lead ID format');
  }

  // Atomic conditional update to prevent race conditions:
  // Only update if leadId matches AND assignedTo is currently null
  const claimedLead = await Lead.findOneAndUpdate(
    { _id: leadId, assignedTo: null },
    { $set: { assignedTo: counselorId } },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'name email');

  if (claimedLead) {
    return claimedLead.toJSON();
  }

  // If claimedLead is null, inspect why:
  const existingLead = await Lead.findById(leadId);

  if (!existingLead) {
    throw notFound(`Lead with ID '${leadId}' was not found`);
  }

  if (existingLead.assignedTo) {
    if (existingLead.assignedTo.toString() === counselorId.toString()) {
      return existingLead.toJSON();
    }
    throw conflict('This lead has already been claimed by another counselor');
  }

  throw conflict('Lead could not be claimed due to a concurrent update. Please try again.');
};

const updateLeadStatus = async (leadId, counselorId, newStatus) => {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw badRequest('Invalid lead ID format');
  }

  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw notFound(`Lead with ID '${leadId}' was not found`);
  }

  // Rule 6 & 7: Other counselors must not be able to modify that lead
  if (!lead.assignedTo || lead.assignedTo.toString() !== counselorId.toString()) {
    throw forbidden('You do not have permission to update the status of this lead');
  }

  lead.status = newStatus;
  await lead.save();

  return lead.toJSON();
};

const getLeadById = async (leadId, counselorId) => {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw badRequest('Invalid lead ID format');
  }

  const lead = await Lead.findById(leadId).populate('assignedTo', 'name email');

  if (!lead) {
    throw notFound(`Lead with ID '${leadId}' was not found`);
  }

  // Rule 8: A counselor must not be able to view another counselor's private leads
  // Allow viewing if lead is unclaimed (assignedTo === null) OR assigned to this counselor
  const isUnclaimed = !lead.assignedTo;
  const isAssignedToMe = lead.assignedTo && lead.assignedTo._id.toString() === counselorId.toString();

  if (!isUnclaimed && !isAssignedToMe) {
    throw forbidden('Access denied: this lead is claimed by another counselor');
  }

  return lead.toJSON();
};

const getDashboardStats = async (counselorId) => {
  const [
    availableLeadsCount,
    myTotalLeadsCount,
    myNewLeadsCount,
    myContactedLeadsCount,
    myConvertedLeadsCount,
    recentPublicLeads,
  ] = await Promise.all([
    Lead.countDocuments({ assignedTo: null }),
    Lead.countDocuments({ assignedTo: counselorId }),
    Lead.countDocuments({ assignedTo: counselorId, status: 'NEW' }),
    Lead.countDocuments({ assignedTo: counselorId, status: 'CONTACTED' }),
    Lead.countDocuments({ assignedTo: counselorId, status: 'CONVERTED' }),
    Lead.find({ assignedTo: null }).sort({ createdAt: -1 }).limit(5),
  ]);

  return {
    availableLeads: availableLeadsCount,
    myTotalLeads: myTotalLeadsCount,
    myNewLeads: myNewLeadsCount,
    myContactedLeads: myContactedLeadsCount,
    myConvertedLeads: myConvertedLeadsCount,
    recentPublicLeads,
  };
};

module.exports = {
  createPublicEnquiry,
  getPublicLeads,
  getMyLeads,
  claimLead,
  updateLeadStatus,
  getLeadById,
  getDashboardStats,
};
