const MidYearReviewService = require('../services/midYearReviewService');
const { catchAsync } = require('../middleware/errorHandler');

class MidYearReviewController {
    static createMidYearReview = catchAsync(async (req, res) => {
        const user_id = req.user.id;
        const data = req.body;

        const result = await MidYearReviewService.createMidYearReview(user_id, data);

        res.status(201).json({
            success: true,
            message: 'Mid-year review saved successfully',
            data: result
        });
    });

    static updateMidYearReview = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const result = await MidYearReviewService.updateMidYearReview(id, data);

        res.status(200).json({
            success: true,
            message: 'Mid-year review updated successfully',
            data: result
        });
    });

    static getMidYearReviewById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await MidYearReviewService.getMidYearReviewById(id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getMyMidYearReview = catchAsync(async (req, res) => {
        const user_id = req.user.id;
        const result = await MidYearReviewService.getMidYearReviewByUserId(user_id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getMidYearReviewByUserId = catchAsync(async (req, res) => {
        const { user_id } = req.params;
        const result = await MidYearReviewService.getMidYearReviewByUserId(user_id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static deleteMidYearReview = catchAsync(async (req, res) => {
        const { id } = req.params;
        await MidYearReviewService.deleteMidYearReview(id);

        res.status(200).json({
            success: true,
            message: 'Mid-year review deleted successfully'
        });
    });
}

module.exports = MidYearReviewController;
