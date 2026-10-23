const { ROLE_PRIORITY } = require('../constants/ticket.constants');
const dashboardRepository = require('../repositories/dashboard.repository');
const ticketRepository = require('../repositories/ticket.repository');
const getDashboardSummary = async (userId) => {
    const roles = await ticketRepository.findUserRoles(userId);
    const effectiveRole = ROLE_PRIORITY.find(
        role => roles.includes(role)
    );

    if (!effectiveRole) {
        throw new Error('No valid role found for dashboard access');
    }
    // Fetch summary metrics and recent tickets.
    const summary = await dashboardRepository.getSummary(
        effectiveRole,
        userId
    );

    const recentTickets = await dashboardRepository.getRecentTickets(
        effectiveRole,
        userId
    );

    let roleSummary;

    switch (effectiveRole) {
        case 'ADMIN':
            roleSummary = {
                totalTickets: summary.total_tickets,
                openTickets: summary.open_tickets,
                resolvedTickets: summary.resolved_tickets
            };
            break;

        case 'MANAGER':
            roleSummary = {
                teamTickets: summary.total_tickets,
                openTickets: summary.open_tickets,
                unassignedTickets: summary.unassigned_tickets
            };
            break;

        case 'SUPPORT_AGENT':
            roleSummary = {
                assignedToMe: summary.total_tickets,
                openTickets: summary.open_tickets,
                highPriorityTickets: summary.high_priority_tickets
            };
            break;

        case 'CUSTOMER':
            roleSummary = {
                myTickets: summary.total_tickets,
                openTickets: summary.open_tickets,
                resolvedTickets: summary.resolved_tickets
            };
            break;
    }

    return {
        effectiveRole,
        summary: roleSummary,
        recentTickets
    };
};
module.exports = {
    getDashboardSummary
};
