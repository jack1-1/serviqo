const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const aiController = require('../controllers/ai.controller')
const authMiddleware = require('../middlewares/auth.middleware');
const { requirePermission } = require('../middlewares/permission.middleware');
const {validateCreateTicket}= require('../validators/ticket.validators');
const {validateTicketSearch}= require('../validators/ticket.validators');
const router = express.Router();
router.get('/categories', 
    authMiddleware, 
    requirePermission('VIEW_TICKET'), 
    ticketController.getCategories
);

router.get(
    '/priorities',
    authMiddleware,
    requirePermission('VIEW_TICKET'),
    ticketController.getPriorities
);

router.get(
    '/statuses',
    authMiddleware,
    requirePermission('VIEW_TICKET'),
    ticketController.getStatuses
);
//AI-suggestions

router.post(
    '/ai-suggestions',
    authMiddleware,
    requirePermission('CREATE_TICKET'),
    aiController.generateTicketSuggestions
);


router.post(
    '/ai-suggestions',
    authMiddleware,
    requirePermission('CREATE_TICKET'),
    aiController.generateTicketSuggestions
);


// create ticket //
router.post(
    '/create-ticket',
    authMiddleware,
    requirePermission('CREATE_TICKET'),
    validateCreateTicket,
    ticketController.createTicket
    );
// search ticket //
router.post(
    '/search',
    authMiddleware,
    requirePermission('VIEW_TICKET'),
    validateTicketSearch,
    ticketController.searchTickets
);

module.exports=router;