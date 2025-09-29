const AppraisalService = require('../services/appraisalService');
const { catchAsync } = require('../middleware/errorHandler');

class AppraisalController {
  // Get all appraisals
  static getAppraisals = catchAsync(async (req, res) => {
    const options = req.query;
    
    const result = await AppraisalService.getAppraisals(options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Get appraisal by ID
  static getAppraisalById = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    
    const appraisal = await AppraisalService.getAppraisalById(appraisalId);
    
    res.status(200).json({
      success: true,
      data: appraisal
    });
  });
  
  // Create new appraisal
  static createAppraisal = catchAsync(async (req, res) => {
    const appraisalData = req.body;
    
    const appraisal = await AppraisalService.createAppraisal(appraisalData);
    
    res.status(201).json({
      success: true,
      message: 'Appraisal created successfully',
      data: appraisal
    });
  });
  
  // Update appraisal
  static updateAppraisal = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    const updateData = req.body;
    
    const appraisal = await AppraisalService.updateAppraisal(appraisalId, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Appraisal updated successfully',
      data: appraisal
    });
  });
  
  // Delete appraisal
  static deleteAppraisal = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    
    const result = await AppraisalService.deleteAppraisal(appraisalId);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  });
  
  // Get appraisals by employee
  static getAppraisalsByEmployee = catchAsync(async (req, res) => {
    const employeeId = req.params.employeeId;
    const options = req.query;
    
    const result = await AppraisalService.getAppraisalsByEmployee(employeeId, options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Get appraisals by appraiser
  static getAppraisalsByAppraiser = catchAsync(async (req, res) => {
    const appraiserId = req.params.appraiserId;
    const options = req.query;
    
    const result = await AppraisalService.getAppraisalsByAppraiser(appraiserId, options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Get appraisals by period
  static getAppraisalsByPeriod = catchAsync(async (req, res) => {
    const { periodStart, periodEnd } = req.params;
    const options = req.query;
    
    const result = await AppraisalService.getAppraisalsByPeriod(periodStart, periodEnd, options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Update appraisal status
  static updateAppraisalStatus = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    const { status } = req.body;
    
    const appraisal = await AppraisalService.updateAppraisalStatus(appraisalId, status);
    
    res.status(200).json({
      success: true,
      message: 'Appraisal status updated successfully',
      data: appraisal
    });
  });
  
  // Add signature to appraisal
  static addSignature = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    const signatureData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    const result = await AppraisalService.addSignature(appraisalId, signatureData);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  });
  
  // Get appraisal signatures
  static getSignatures = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    
    const signatures = await AppraisalService.getSignatures(appraisalId);
    
    res.status(200).json({
      success: true,
      data: signatures
    });
  });
  
  // Get appraisal statistics
  static getAppraisalStatistics = catchAsync(async (req, res) => {
    const statistics = await AppraisalService.getAppraisalStatistics();
    
    res.status(200).json({
      success: true,
      data: statistics
    });
  });
  
  static getDashboardOverview = catchAsync(async (req, res) => {
    const overview = await AppraisalService.getDashboardOverview(req.user);

    res.status(200).json({
      success: true,
      data: overview
    });
  });
  
  // Get team appraisals
  static getTeamAppraisals = catchAsync(async (req, res) => {
    const managerId = req.user.id;
    const options = req.query;
    
    const result = await AppraisalService.getTeamAppraisals(managerId, options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Export appraisal
  static exportAppraisal = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    
    const exportData = await AppraisalService.exportAppraisal(appraisalId);
    
    res.status(200).json({
      success: true,
      data: exportData
    });
  });
  
  // Bulk export appraisals
  static bulkExportAppraisals = catchAsync(async (req, res) => {
    const options = req.query;
    
    const exportData = await AppraisalService.bulkExportAppraisals(options);
    
    res.status(200).json({
      success: true,
      data: exportData
    });
  });
}

module.exports = AppraisalController;
