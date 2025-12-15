const AnnualAppraisalService = require('../services/annualAppraisalService');
const { catchAsync } = require('../middleware/errorHandler');

class AnnualAppraisalController {
    static createAnnualAppraisal = catchAsync(async (req, res) => {
        // Use targetUserId from body if provided (review mode), otherwise use logged-in user
        const user_id = req.body.targetUserId || req.user.id;
        const data = req.body;

        const result = await AnnualAppraisalService.createAnnualAppraisal(user_id, data);

        res.status(201).json({
            success: true,
            message: 'Annual appraisal saved successfully',
            data: result
        });
    });

    static updateAnnualAppraisal = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const result = await AnnualAppraisalService.updateAnnualAppraisal(id, data);

        res.status(200).json({
            success: true,
            message: 'Annual appraisal updated successfully',
            data: result
        });
    });

    static getAnnualAppraisalById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await AnnualAppraisalService.getAnnualAppraisalById(id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getMyAnnualAppraisal = catchAsync(async (req, res) => {
        const user_id = req.user.id;
        const result = await AnnualAppraisalService.getAnnualAppraisalByUserId(user_id);
        console.log(result);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getAnnualAppraisalByUserId = catchAsync(async (req, res) => {
        const { user_id } = req.params;
        const result = await AnnualAppraisalService.getAnnualAppraisalByUserId(user_id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getPerformanceAssessment = catchAsync(async (req, res) => {
        // const user_id = req.user.id;
        const user_id = req.params.user_id;
        const result = await AnnualAppraisalService.getPerformanceAssessment(user_id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static deleteAnnualAppraisal = catchAsync(async (req, res) => {
        const { id } = req.params;
        await AnnualAppraisalService.deleteAnnualAppraisal(id);

        res.status(200).json({
            success: true,
            message: 'Annual appraisal deleted successfully'
        });
    });
}

module.exports = AnnualAppraisalController;
