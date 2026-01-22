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
    const employee_id = req.params.employee_id;
    const options = req.query;

    const result = await AppraisalService.getAppraisalsByEmployee(employee_id, options);

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

  // Get current in-progress appraisal for the logged-in user
  // Query params: role=manager&employeeId=xxx for manager view
  static getCurrentAppraisal = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { role, employeeId } = req.query;

    const appraisal = await AppraisalService.getCurrentAppraisal(userId, { role, employeeId });

    res.status(200).json({
      success: true,
      data: appraisal
    });
  });

  // Update manager's current step when reviewing an employee's appraisal
  static updateManagerStep = catchAsync(async (req, res) => {
    const { employeeId, step } = req.body;

    await AppraisalService.updateManagerCurrentStep(employeeId, step);

    res.status(200).json({
      success: true,
      message: 'Manager step updated successfully'
    });
  });

  // Get form lock status for user's appraisal
  static getFormLockStatus = catchAsync(async (req, res) => {
    const userId = req.query.userId || req.user.id;

    const lockStatus = await AppraisalService.getFormLockStatus(userId);

    res.status(200).json({
      success: true,
      data: lockStatus
    });
  });

  // Get team appraisals
  static getTeamAppraisals = catchAsync(async (req, res) => {
    const manager_id = req.user.id;
    const options = req.query;

    const result = await AppraisalService.getTeamAppraisals(manager_id, options);

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

  // Submit appraisal (consolidate all form data)
  static submitAppraisal = catchAsync(async (req, res) => {
    const user_id = req.user.id;

    const appraisal = await AppraisalService.submitAppraisal(user_id);

    res.status(201).json({
      success: true,
      message: 'Appraisal submitted successfully',
      data: appraisal
    });
  });

  // Get my submitted appraisals
  static getMyAppraisals = catchAsync(async (req, res) => {
    const user_id = req.user.id;

    const appraisals = await AppraisalService.getAppraisalsByEmployee(user_id);

    res.status(200).json({
      success: true,
      data: appraisals
    });
  });

  // Get appraisals where current user is the appraiser (for history)
  static getMyAppraisalHistory = catchAsync(async (req, res) => {
    const appraiserId = req.user.id;

    const appraisals = await AppraisalService.getAppraisalsByAppraiser(appraiserId);

    res.status(200).json({
      success: true,
      data: { appraisals }
    });
  });

  // Approve appraisal (manager only)
  static approveAppraisal = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    const manager_id = req.user.id;
    const { comments } = req.body;

    const appraisal = await AppraisalService.approveAppraisal(appraisalId, manager_id, comments);

    res.status(200).json({
      success: true,
      message: 'Appraisal approved successfully',
      data: appraisal
    });
  });

  // Reject appraisal (manager only)
  static rejectAppraisal = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    const manager_id = req.user.id;
    const { comments } = req.body;

    const appraisal = await AppraisalService.rejectAppraisal(appraisalId, manager_id, comments);

    res.status(200).json({
      success: true,
      message: 'Appraisal rejected successfully',
      data: appraisal
    });
  });

  // Complete appraisal (manager only) - finalizes and cleans up form tables
  static completeAppraisal = catchAsync(async (req, res) => {
    const appraisalId = req.params.id;
    const manager_id = req.user.id;

    const appraisal = await AppraisalService.completeAppraisal(appraisalId, manager_id);

    res.status(200).json({
      success: true,
      message: 'Appraisal completed and sealed successfully',
      data: appraisal
    });
  });
}

module.exports = AppraisalController;
