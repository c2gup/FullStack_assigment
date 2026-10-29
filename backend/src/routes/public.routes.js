const express = require('express');
const publicController = require('../controllers/public.controller');
const { validateBody } = require('../middleware/validate.middleware');
const { publicEnquiryLimiter } = require('../middleware/rateLimit.middleware');
const { publicEnquirySchema } = require('../validators/schemas');

const router = express.Router();

router.post('/enquiries', publicEnquiryLimiter, validateBody(publicEnquirySchema), publicController.createEnquiry);

module.exports = router;
