const { query } = require('../config/database');

const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId;

            const sqlquery = `
                SELECT 1
                FROM user_roles ur
                JOIN role_permissions rp
                    ON ur.role_id = rp.role_id
                JOIN permissions p
                    ON rp.permission_id = p.id
                WHERE ur.user_id = $1
                AND p.name = $2;
            `;

            const result = await query(sqlquery, [
                userId,
                permissionName
            ]);

            if (result.rowCount === 0) {
                return res.status(403).json({
                    message: 'You do not have permission to perform this action'
                });
            }

            next();

        } catch (error) {
            console.error('Permission middleware error:', error);

            return res.status(500).json({
                message: 'Internal server error'
            });
        }
    };
};

module.exports = {requirePermission};