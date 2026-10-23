
const dashboardService = require('../services/dashboard.service');

const getSummary = async (req, res, next) => {
    
    try {
        const userId = req.user?.userId;

        const dashboardData =
            await dashboardService.getDashboardSummary(userId);

        return res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummary
};
