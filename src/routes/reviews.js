const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authenticateToken, canAccessAppraisal } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Mid-year review routes
router.post('/mid-year/:appraisalId', canAccessAppraisal, ReviewController.createMidYearReview);
router.get('/mid-year/:appraisalId', canAccessAppraisal, ReviewController.getMidYearReview);
router.put('/mid-year/:appraisalId', canAccessAppraisal, ReviewController.updateMidYearReview);
router.patch('/mid-year/:appraisalId/status', canAccessAppraisal, ReviewController.updateMidYearReviewStatus);
router.post('/mid-year/:appraisalId/signature', canAccessAppraisal, ReviewController.addMidYearReviewSignature);
router.delete('/mid-year/:appraisalId', canAccessAppraisal, ReviewController.deleteMidYearReview);

// End-year review routes
router.post('/end-year/:appraisalId', canAccessAppraisal, ReviewController.createEndYearReview);
router.get('/end-year/:appraisalId', canAccessAppraisal, ReviewController.getEndYearReview);
router.put('/end-year/:appraisalId', canAccessAppraisal, ReviewController.updateEndYearReview);
router.patch('/end-year/:appraisalId/status', canAccessAppraisal, ReviewController.updateEndYearReviewStatus);
router.post('/end-year/:appraisalId/signature', canAccessAppraisal, ReviewController.addEndYearReviewSignature);
router.delete('/end-year/:appraisalId', canAccessAppraisal, ReviewController.deleteEndYearReview);

// Get all reviews (admin/manager only)
router.get('/mid-year', ReviewController.getAllMidYearReviews);
router.get('/end-year', ReviewController.getAllEndYearReviews);

module.exports = router;
