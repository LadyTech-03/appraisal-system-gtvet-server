const EndYearReviewService = require('../services/endYearReviewService');
const { catchAsync } = require('../middleware/errorHandler');

class EndYearReviewController {
    static createEndYearReview = catchAsync(async (req, res) => {
        const user_id = req.user.id;
        const data = req.body;

        const result = await EndYearReviewService.createEndYearReview(user_id, data);

        res.status(201).json({
            success: true,
            message: 'End-year review saved successfully',
            data: result
        });
    });

    static updateEndYearReview = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const result = await EndYearReviewService.updateEndYearReview(id, data);

        res.status(200).json({
            success: true,
            message: 'End-year review updated successfully',
            data: result
        });
    });

    static getEndYearReviewById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await EndYearReviewService.getEndYearReviewById(id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getMyEndYearReview = catchAsync(async (req, res) => {
        const user_id = req.user.id;
        const result = await EndYearReviewService.getEndYearReviewByUserId(user_id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getEndYearReviewByUserId = catchAsync(async (req, res) => {
        const { user_id } = req.params;
        const result = await EndYearReviewService.getEndYearReviewByUserId(user_id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static deleteEndYearReview = catchAsync(async (req, res) => {
        const { id } = req.params;
        await EndYearReviewService.deleteEndYearReview(id);

        res.status(200).json({
            success: true,
            message: 'End-year review deleted successfully'
        });
    });
}

module.exports = EndYearReviewController;
