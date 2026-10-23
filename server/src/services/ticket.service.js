const ticketRepository= require('../repositories/ticket.repository');

const getTicketCategories = async () => {
    return ticketRepository.getCategories();
};

const getTicketPriorities = async () => {
    return ticketRepository.getPriorties();
};

const getTicketStatuses = async () => {
    return ticketRepository.getStatuses();
};

 // create ticekt //
const createTicket= async({
    title,
    description,
    categoryId,
    priorityId,
    createdBy
})=>{
    // check if user creating ticket for active/valid category, priority, status //
    const category= await ticketRepository.findActiveCategoryById(categoryId);
    
    if(!category){
        // console.log('inside');
        
        const error = new Error('Invalid ticket category');
        error.statusCode = 400;
        throw error;
    }
    const priority = await ticketRepository.findActivePriorityById(priorityId);

    if (!priority) {
        const error = new Error('Invalid ticket priority');
        error.statusCode = 400;
        throw error;
    }

    const status =
        await ticketRepository.findStatusByCode('OPEN');

    if (!status) {
        const error = new Error('Default ticket status OPEN not configured');
        error.statusCode = 500;
        throw error;
    }
    return ticketRepository.createTicket({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        priorityId,
        statusId: status.id,
        createdBy
    })
}

/// serach tickets as per payload //
const { ROLE_PRIORITY } = require('../constants/ticket.constants');

// const getEffectiveRole = (roles) => {
//     for (const role of ROLE_PRIORITY) {
//         if (roles.includes(role)) {
//             return role;
//         }
//     }

//     return null;
// };

const searchTickets = async (user, filters) => {
    // const role = getEffectiveRole(user.roles);
    const roles = await ticketRepository.findUserRoles(user.userId);
    const effectiveRole = ROLE_PRIORITY.find(
        role => roles.includes(role)
    );
    if (!effectiveRole) {
        throw new Error('User does not have a valid ticket access role.');
    }

    const scope = {
        role:effectiveRole,
        userId: user.userId
    };

    return ticketRepository.searchTickets(
        scope,
        filters
    );
};

module.exports = {
    getTicketCategories,
    getTicketPriorities,
    getTicketStatuses,
    createTicket,
    searchTickets
};
