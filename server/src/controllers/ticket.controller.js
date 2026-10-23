// ticket.controller.js

const ticketService = require('../services/ticket.service');

const getCategories = async (req, res, next) => {
    try {
        const categories = await ticketService.getTicketCategories();

        res.status(200).json({
            message: 'Ticket categories fetched successfully',
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

const getPriorities = async (req, res, next) => {
    try {
        const priorities = await ticketService.getTicketPriorities();

        res.status(200).json({
            message: 'Ticket priorities fetched successfully',
            data: priorities
        });
    } catch (error) {
        next(error);
    }
};

const getStatuses = async (req, res, next) => {
    try {
        const statuses = await ticketService.getTicketStatuses();

        res.status(200).json({
            message: 'Ticket statuses fetched successfully',
            data: statuses
        });
    } catch (error) {
        next(error);
    }
};

const createTicket = async (req, res, next) => {
    try {
        const {
            title,
            description,
            categoryId,
            priorityId
        } = req.body;

        const createdBy = req.user?.userId;
        const ticket = await ticketService.createTicket({
            title,
            description,
            categoryId: Number(categoryId),
            priorityId: Number(priorityId),
            createdBy
        });

        return res.status(201).json({
            message: 'Ticket created successfully',
            data: ticket
        });
    } catch (error) {

    }
}

const searchTickets = async (req, res, next) => {
    try {
        console.log('controller',req.user);
        
        const result = await ticketService.searchTickets(
            req.user,
            req.ticketSearch
        );

        return res.status(200).json({
            message: 'Tickets fetched successfully.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getCategories,
    getPriorities,
    getStatuses,
    createTicket,
    searchTickets
};