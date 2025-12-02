const FinalSectionsService = require('../services/finalSectionsService');
const { catchAsync } = require('../middleware/errorHandler');

class FinalSectionsController {
    static createFinalSections = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const data = req.body;

        const result = await FinalSectionsService.createFinalSections(userId, data);

        res.status(201).json({
            success: true,
            message: 'Final sections saved successfully',
            data: result
        });
    });

    static updateFinalSections = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const result = await FinalSectionsService.updateFinalSections(id, data);

        res.status(200).json({
            success: true,
            message: 'Final sections updated successfully',
            data: result
        });
    });

    static getFinalSectionsById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await FinalSectionsService.getFinalSectionsById(id);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getMyFinalSections = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const result = await FinalSectionsService.getFinalSectionsByUserId(userId);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static getFinalSectionsByUserId = catchAsync(async (req, res) => {
        const { userId } = req.params;
        const result = await FinalSectionsService.getFinalSectionsByUserId(userId);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    static deleteFinalSections = catchAsync(async (req, res) => {
        const { id } = req.params;
        await FinalSectionsService.deleteFinalSections(id);

        res.status(200).json({
            success: true,
            message: 'Final sections deleted successfully'
        });
    });
}

module.exports = FinalSectionsController;
