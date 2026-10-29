const express = require('express');
const leadController = require('../controllers/lead.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateBody, validateQuery } = require('../middleware/validate.middleware');
const { leadQuerySchema, updateStatusSchema } = require('../validators/schemas');

const router = express.Router();

// All lead routes require authentication
router.use(authenticate);

router.get('/public', validateQuery(leadQuerySchema), leadController.getPublic);
router.get('/my', validateQuery(leadQuerySchema), leadController.getMy);
router.get('/stats', leadController.getStats);
router.patch('/:id/claim', leadController.claim);
router.patch('/:id/status', validateBody(updateStatusSchema), leadController.updateStatus);
router.get('/:id', leadController.getById);

module.exports = router;
