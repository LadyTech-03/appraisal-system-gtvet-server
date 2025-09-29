const MidYearReview = require('../models/MidYearReview');
const EndYearReview = require('../models/EndYearReview');
const Appraisal = require('../models/Appraisal');
const { catchAsync } = require('../middleware/errorHandler');

class ReviewController {
  // Create mid-year review
  static createMidYearReview = catchAsync(async (req, res) => {
    const reviewData = {
      ...req.body,
      appraisalId: req.params.appraisalId
    };
    
    const review = await MidYearReview.create(reviewData);
    
    res.status(201).json({
      success: true,
      message: 'Mid-year review created successfully',
      data: review.toJSON()
    });
  });
  
  // Get mid-year review
  static getMidYearReview = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    
    const review = await MidYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Mid-year review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review.toJSON()
    });
  });
  
  // Update mid-year review
  static updateMidYearReview = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    const updateData = req.body;
    
    const review = await MidYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Mid-year review not found'
      });
    }
    
    await review.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Mid-year review updated successfully',
      data: review.toJSON()
    });
  });
  
  // Update mid-year review status
  static updateMidYearReviewStatus = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    const { status } = req.body;
    
    const review = await MidYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Mid-year review not found'
      });
    }
    
    await review.updateStatus(status);
    
    res.status(200).json({
      success: true,
      message: 'Mid-year review status updated successfully',
      data: review.toJSON()
    });
  });
  
  // Add signature to mid-year review
  static addMidYearReviewSignature = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    const { signatureType, signature } = req.body;
    
    const review = await MidYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Mid-year review not found'
      });
    }
    
    await review.addSignature(signatureType, signature);
    
    res.status(200).json({
      success: true,
      message: 'Signature added successfully',
      data: review.toJSON()
    });
  });
  
  // Create end-year review
  static createEndYearReview = catchAsync(async (req, res) => {
    const reviewData = {
      ...req.body,
      appraisalId: req.params.appraisalId
    };
    
    const review = await EndYearReview.create(reviewData);
    
    res.status(201).json({
      success: true,
      message: 'End-year review created successfully',
      data: review.toJSON()
    });
  });
  
  // Get end-year review
  static getEndYearReview = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    
    const review = await EndYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'End-year review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review.toJSON()
    });
  });
  
  // Update end-year review
  static updateEndYearReview = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    const updateData = req.body;
    
    const review = await EndYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'End-year review not found'
      });
    }
    
    await review.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'End-year review updated successfully',
      data: review.toJSON()
    });
  });
  
  // Update end-year review status
  static updateEndYearReviewStatus = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    const { status } = req.body;
    
    const review = await EndYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'End-year review not found'
      });
    }
    
    await review.updateStatus(status);
    
    res.status(200).json({
      success: true,
      message: 'End-year review status updated successfully',
      data: review.toJSON()
    });
  });
  
  // Add signature to end-year review
  static addEndYearReviewSignature = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    const { signatureType, signature } = req.body;
    
    const review = await EndYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'End-year review not found'
      });
    }
    
    await review.addSignature(signatureType, signature);
    
    res.status(200).json({
      success: true,
      message: 'Signature added successfully',
      data: review.toJSON()
    });
  });
  
  // Get all mid-year reviews
  static getAllMidYearReviews = catchAsync(async (req, res) => {
    const options = req.query;
    
    const result = await MidYearReview.findAll(options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Get all end-year reviews
  static getAllEndYearReviews = catchAsync(async (req, res) => {
    const options = req.query;
    
    const result = await EndYearReview.findAll(options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Delete mid-year review
  static deleteMidYearReview = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    
    const review = await MidYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Mid-year review not found'
      });
    }
    
    await review.delete();
    
    res.status(200).json({
      success: true,
      message: 'Mid-year review deleted successfully'
    });
  });
  
  // Delete end-year review
  static deleteEndYearReview = catchAsync(async (req, res) => {
    const appraisalId = req.params.appraisalId;
    
    const review = await EndYearReview.findByAppraisalId(appraisalId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'End-year review not found'
      });
    }
    
    await review.delete();
    
    res.status(200).json({
      success: true,
      message: 'End-year review deleted successfully'
    });
  });
}

module.exports = ReviewController;
