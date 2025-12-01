const express = require('express');
const router = express.Router();
const MidYearReviewController = require('../controllers/midYearReviewController');
const { authenticateToken, requireManager } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/me', MidYearReviewController.getMyMidYearReview);
router.post('/', MidYearReviewController.createMidYearReview);
router.get('/:id', MidYearReviewController.getMidYearReviewById);
router.put('/:id', MidYearReviewController.updateMidYearReview);
router.delete('/:id', requireManager, MidYearReviewController.deleteMidYearReview);
router.get('/user/:userId', MidYearReviewController.getMidYearReviewByUserId);

module.exports = router;
