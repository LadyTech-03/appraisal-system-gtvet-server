const PerformancePlanningService = require('../services/performancePlanningService');
const { catchAsync } = require('../middleware/errorHandler');

class PerformancePlanningController {
    static createPerformancePlanning = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const data = req.body;

        const result = await PerformancePlanningService.createPerformancePlanning(userId, data);

        res.status(201).json({
            success: true,
            message: 'Performance planning saved successfully',
            data: result
        });
    });

    static updatePerformancePlanning = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const result = await PerformancePlanningService.updatePerformancePlanning(id, data);

        res.status(200).json({
            success: true,
            message: 'Performance planning updated successfully',
            data: result
        });
    });

    static getPerformancePlanningById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await PerformancePlanningService.getPerformancePlanningById(id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getMyPerformancePlanning = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const result = await PerformancePlanningService.getPerformancePlanningByUserId(userId);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getPerformancePlanningByUserId = catchAsync(async (req, res) => {
        const { userId } = req.params;
        const result = await PerformancePlanningService.getPerformancePlanningByUserId(userId);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static deletePerformancePlanning = catchAsync(async (req, res) => {
        const { id } = req.params;
        await PerformancePlanningService.deletePerformancePlanning(id);

        res.status(200).json({
            success: true,
            message: 'Performance planning deleted successfully'
        });
    });
}

module.exports = PerformancePlanningController;
