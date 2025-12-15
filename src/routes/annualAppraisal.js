const express = require('express');
const router = express.Router();
const AnnualAppraisalController = require('../controllers/annualAppraisalController');
const { authenticateToken, requireManager } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/me', AnnualAppraisalController.getMyAnnualAppraisal);
router.post('/', AnnualAppraisalController.createAnnualAppraisal);
router.get('/:id', AnnualAppraisalController.getAnnualAppraisalById);
router.put('/:id', AnnualAppraisalController.updateAnnualAppraisal);
router.delete('/:id', requireManager, AnnualAppraisalController.deleteAnnualAppraisal);
router.get('/user/:user_id', AnnualAppraisalController.getAnnualAppraisalByUserId);
router.get('/performance-assessment/:user_id', AnnualAppraisalController.getPerformanceAssessment);

module.exports = router;
