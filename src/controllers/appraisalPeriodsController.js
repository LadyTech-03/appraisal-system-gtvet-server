const AppraisalPeriodsService = require('../services/appraisalPeriodsService');
const { parseApiError } = require('../middleware/errorHandler');

class AppraisalPeriodsController {
    /**
     * Get availability for all sections
     * GET /api/appraisal-periods
     */
    static async getAvailability(req, res) {
        try {
            const availability = await AppraisalPeriodsService.getAvailability();
            res.json({ data: availability });
        } catch (error) {
            const apiError = parseApiError(error);
            res.status(apiError.status).json({ error: apiError.message });
        }
    }

    /**
     * Get availability for a specific section
     * GET /api/appraisal-periods/:sectionName
     */
    static async getSectionAvailability(req, res) {
        try {
            const { sectionName } = req.params;
            const section = await AppraisalPeriodsService.getSectionAvailability(sectionName);
            res.json({ data: section });
        } catch (error) {
            const apiError = parseApiError(error);
            res.status(apiError.status).json({ error: apiError.message });
        }
    }

    /**
     * Update availability for a section (Admin only)
     * PUT /api/appraisal-periods/:sectionName
     */
    static async updateAvailability(req, res) {
        try {
            const { sectionName } = req.params;
            const updated = await AppraisalPeriodsService.updateAvailability(sectionName, req.body);
            res.json({
                message: 'Availability updated successfully',
                data: updated
            });
        } catch (error) {
            const apiError = parseApiError(error);
            res.status(apiError.status).json({ error: apiError.message });
        }
    }
}

module.exports = AppraisalPeriodsController;
