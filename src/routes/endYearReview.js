const express = require('express');
const router = express.Router();
const EndYearReviewController = require('../controllers/endYearReviewController');
const { authenticateToken, requireManager } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/me', EndYearReviewController.getMyEndYearReview);
router.post('/', EndYearReviewController.createEndYearReview);
router.get('/:id', EndYearReviewController.getEndYearReviewById);
router.put('/:id', EndYearReviewController.updateEndYearReview);
router.delete('/:id', requireManager, EndYearReviewController.deleteEndYearReview);
router.get('/user/:user_id', EndYearReviewController.getEndYearReviewByUserId);

module.exports = router;
