const { query } = require('../config/database');
const pool = require('../config/db');
//to display dropdowns //

const getCategories = async () => {
    const result = await query(`
        select id,
        code,
        name,
        description 
        from ticket_categories
        where is_Active=TRUE
        order by display_order,id
        `)
    return result.rows;
}

const getStatuses = async () => {
    const result = await query(`
        select id,
        code,
        name,
        description 
        from ticket_statuses
        where is_Active=TRUE
        order by display_order,id
        `)
    return result.rows;
}

const getPriorties = async () => {
    const result = await query(`
        select id,
        code,
        name,
        description 
        from ticket_priorities
        where is_Active=TRUE
        order by display_order,id
        `)
    return result.rows;
}

// lookup methods while creating tickets //

const createTicket = async ({
    title,
    description,
    categoryId,
    priorityId,
    statusId,
    createdBy
}) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const ticketResult = await client.query(
            `INSERT INTO tickets (
                title,
                description,
                category_id,
                priority_id,
                status_id,
                created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, created_at
            `,
            [
                title,
                description,
                categoryId,
                priorityId,
                statusId,
                createdBy
            ]
        );
        const ticket = ticketResult.rows[0];
        const year = new Date().getFullYear();

        const ticketNumber = `TKT-${year}-${String(ticket.id).padStart(6, '0')}`;
        // update created ticket with ticket number //
        await client.query(
            `update tickets 
             set ticket_number=$1
             where id=$2
            `,
            [ticketNumber, ticket.id]
        );
        // in same txn create record in history //
        await client.query(
            `
            INSERT INTO ticket_history (
                ticket_id,
                changed_by,
                field_name,
                old_value,
                new_value
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                ticket.id,
                createdBy,
                'STATUS',
                null,
                'OPEN'
            ]
        );
        await client.query('COMMIT');
        return {
            id: ticket.id,
            ticketNumber,
            createdAt: ticket.created_at
        };

    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
}

const findActiveCategoryById = async (categoryId) => {

    const result = await pool.query(
        `
        SELECT id, code, name
        FROM ticket_categories
        WHERE id = $1
          AND is_active = TRUE
        `,
        [categoryId]
    );

    return result.rows[0] || null;
};

const findActivePriorityById = async (priorityId) => {

    const result = await pool.query(
        `
        SELECT id, code, name
        FROM ticket_priorities
        WHERE id = $1
          AND is_active = TRUE
        `,
        [priorityId]
    );

    return result.rows[0] || null;
};

const findStatusByCode = async (code) => {

    const result = await pool.query(
        `
        SELECT id, code, name
        FROM ticket_statuses
        WHERE code = $1
          AND is_active = TRUE
        `,
        [code]
    );

    return result.rows[0] || null;
};

const findUserRoles = async (userId) => {

    const sqlquery = `
        SELECT r.name
        FROM user_roles ur
        INNER JOIN roles r
            ON r.id = ur.role_id
        WHERE ur.user_id = $1
    `;

    const result = await query(sqlquery, [userId]);

    return result.rows.map(row => row.name);
};

// serach ticket query //
const searchTickets = async (scope, filters) => {
    const { role, userId } = scope;
    const { page, limit, dateRange } = filters;
    console.log(role, 'rolename');

    const values = [];
    const conditions = [];

    // --------------------------------------------------
    // 1. Role-based visibility
    // --------------------------------------------------

    if (role === 'CUSTOMER') {
        values.push(userId);

        conditions.push(`
            t.created_by = $${values.length}
        `);
    }

    if (role === 'AGENT' || role === "SUPPORT_AGENT") {
        values.push(userId);

        conditions.push(`
            t.assigned_to = $${values.length}
        `);
    }

    if (role === 'MANAGER') {
        values.push(userId);

        conditions.push(`
            t.team_id IN (
                SELECT team.id
                FROM teams team
                WHERE team.manager_id = $${values.length}
                  AND team.is_active = TRUE
            )
        `);
    }

    // ADMIN gets no ownership restriction.


    // --------------------------------------------------
    // 2. Date range
    // --------------------------------------------------

    if (dateRange === 'TODAY') {

        conditions.push(`
            t.created_at >= CURRENT_DATE
            AND t.created_at < CURRENT_DATE + INTERVAL '1 day'
        `);

    } else if (dateRange === 'LAST_7_DAYS') {

        conditions.push(`
            t.created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
        `);

    } else if (dateRange === 'LAST_30_DAYS') {

        conditions.push(`
            t.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        `);

    } else if (dateRange === 'LAST_90_DAYS') {

        conditions.push(`
            t.created_at >= CURRENT_TIMESTAMP - INTERVAL '90 days'
        `);
    }

    // other filters //
    applyTicketFilters(
        filters,
        conditions,
        values
    );

    // --------------------------------------------------
    // 3. WHERE clause
    // --------------------------------------------------

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : '';


    // --------------------------------------------------
    // 4. Pagination
    // --------------------------------------------------

    const offset = (page - 1) * limit;


    // --------------------------------------------------
    // 5. Count query
    // --------------------------------------------------

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM tickets t
        ${whereClause}
    `;

    const countResult = await query(
        countQuery,
        values
    );

    const totalRecords = Number(countResult.rows[0].total);


    // --------------------------------------------------
    // 6. Data query
    // --------------------------------------------------

    const dataValues = [...values];

    dataValues.push(limit);
    const limitParam = dataValues.length;

    dataValues.push(offset);
    const offsetParam = dataValues.length;

    const dataQuery = `
        SELECT
            t.id,
            t.ticket_number,
            t.title,
            t.description,
            t.category_id,
            t.priority_id,
            t.status_id,
            t.created_by,
            t.assigned_to,
            t.team_id,
            t.created_at,
            t.updated_at,
            t.resolved_at,
            t.closed_at

        FROM tickets t

        ${whereClause}

        ORDER BY t.created_at DESC

        LIMIT $${limitParam}
        OFFSET $${offsetParam}
    `;

    const dataResult = await query(
        dataQuery,
        dataValues
    );

    return {
        tickets: dataResult.rows,
        pagination: {
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit)
        }
    };
};

//
function applyTicketFilters(
  filters,
  conditions,
  values
) {
  const addArrayFilter = (column, ids) => {
    if (ids.length === 0) return;

    values.push(ids);
    conditions.push(
      `${column} = ANY($${values.length}::int[])`
    );
  };

  addArrayFilter(
    't.status_id',
    filters.statusIds
  );

  addArrayFilter(
    't.priority_id',
    filters.priorityIds
  );

  addArrayFilter(
    't.category_id',
    filters.categoryIds
  );

  addArrayFilter(
    't.team_id',
    filters.teamIds
  );

  addArrayFilter(
    't.assigned_to',
    filters.assignedToIds
  );

  if (filters.search) {
    values.push(`%${filters.search}%`);
    const param = `$${values.length}`;

    conditions.push(`
      (
        t.ticket_number ILIKE ${param}
        OR t.title ILIKE ${param}
      )
    `);
  }
}
module.exports = { getCategories, getPriorties, getStatuses, findActiveCategoryById, findActivePriorityById, findStatusByCode, createTicket, findUserRoles, searchTickets };