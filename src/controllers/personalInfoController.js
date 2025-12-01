const PersonalInfoService = require('../services/personalInfoService');
const { catchAsync } = require('../middleware/errorHandler');

class PersonalInfoController {
    /**
     * Create new personal info
     */
    static createPersonalInfo = catchAsync(async (req, res) => {
        const userId = req.user.id;
        const personalInfoData = req.body;

        const personalInfo = await PersonalInfoService.createPersonalInfo(userId, personalInfoData);

        res.status(201).json({
            success: true,
            message: 'Personal information saved successfully',
            data: personalInfo
        });
    });

    /**
     * Update personal info
     */
    static updatePersonalInfo = catchAsync(async (req, res) => {
        const { id } = req.params;
        const personalInfoData = req.body;

        const personalInfo = await PersonalInfoService.updatePersonalInfo(id, personalInfoData);

        res.status(200).json({
            success: true,
            message: 'Personal information updated successfully',
            data: personalInfo
        });
    });

    /**
     * Get personal info by ID
     */
    static getPersonalInfoById = catchAsync(async (req, res) => {
        const { id } = req.params;

        const personalInfo = await PersonalInfoService.getPersonalInfoById(id);

        res.status(200).json({
            success: true,
            data: personalInfo
        });
    });

    /**
     * Get personal info by user ID
     */
    static getPersonalInfoByUserId = catchAsync(async (req, res) => {
        const { userId } = req.params;

        const personalInfo = await PersonalInfoService.getPersonalInfoByUserId(userId);

        res.status(200).json({
            success: true,
            data: personalInfo
        });
    });

    /**
     * Get current user's personal info
     */
    static getMyPersonalInfo = catchAsync(async (req, res) => {
        const userId = req.user.id;

        const personalInfo = await PersonalInfoService.getPersonalInfoByUserId(userId);

        res.status(200).json({
            success: true,
            data: personalInfo
        });
    });

    /**
     * Get all personal info records (admin only)
     */
    static getAllPersonalInfo = catchAsync(async (req, res) => {
        const options = req.query;

        const result = await PersonalInfoService.getAllPersonalInfo(options);

        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * Delete personal info
     */
    static deletePersonalInfo = catchAsync(async (req, res) => {
        const { id } = req.params;

        const result = await PersonalInfoService.deletePersonalInfo(id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    });
}

module.exports = PersonalInfoController;
