const { query } = require('../config/database');
const getSummary = async (role, userId) => {
    let whereCondition;
    let values = [];

    switch (role) {
        case 'ADMIN':
            whereCondition = 'TRUE';
            break;
        case 'MANGER':
            whereCondition = `t.team_id IN(select id from teams where manager_id=$1)`;
            values = [userId];
            break;
        case 'SUPPORT_AGENT':
            whereCondition = 't.assigned_to = $1';
            values = [userId];
            break;

        case 'CUSTOMER':
            whereCondition = 't.created_by = $1';
            values = [userId];
            break;
        default:
            throw new Error(`Unsupported dashboard role: ${role}`);
    }

    const sqlquery = `select COUNT(*)::int AS total_tickets,
    COUNT(*) FILTER( where ts.code='OPEN'):: int AS opnen_tickets,
    COUNT(*) FILTER( where ts.code='RESOLVED'):: int AS resolved_tickets,
    COUNT(*) FILTER (WHERE t.assigned_to IS NULL)::int AS unassigned_tickets,
    COUNT(*) FILTER (WHERE tp.code IN ('HIGH', 'CRITICAL'))::int AS high_priority_tickets
    FROM tickets t
    INNER JOIN ticket_statuses ts
            ON ts.id = t.status_id

        INNER JOIN ticket_priorities tp
            ON tp.id = t.priority_id

        WHERE ${whereCondition};
    `
    const result = await query(sqlquery, values);

    return result.rows[0];

}
const getRecentTickets = async (role, userId) => {
    let whereCondition;
    let values = [];

    switch (role) {
        case 'ADMIN':
            whereCondition = 'TRUE';
            break;

        case 'MANAGER':
            whereCondition = `
                t.team_id IN (
                    SELECT id
                    FROM teams
                    WHERE manager_id = $1
                )
            `;
            values = [userId];
            break;

        case 'SUPPORT_AGENT':
            whereCondition = 't.assigned_to = $1';
            values = [userId];
            break;

        case 'CUSTOMER':
            whereCondition = 't.created_by = $1';
            values = [userId];
            break;

        default:
            throw new Error(`Unsupported dashboard role: ${role}`);
    }

    const recentTicketsquery = `
        SELECT
            t.id,
            t.ticket_number,
            t.title,
            ts.code AS status_code,
            ts.name AS status_name,
            tp.code AS priority_code,
            tp.name AS priority_name,
            tc.name AS category_name,
            t.created_at,
            t.updated_at

        FROM tickets t

        INNER JOIN ticket_statuses ts
            ON ts.id = t.status_id

        INNER JOIN ticket_priorities tp
            ON tp.id = t.priority_id

        INNER JOIN ticket_categories tc
            ON tc.id = t.category_id

        WHERE ${whereCondition}

        ORDER BY t.created_at DESC, t.id DESC

        LIMIT 5;
    `;

    const result = await query(recentTicketsquery, values);

    return result.rows;
};

module.exports = {
    getSummary,
    getRecentTickets
};