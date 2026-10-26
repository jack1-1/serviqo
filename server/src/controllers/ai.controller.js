// AI suugestion controller
const aiService= require('../services/ai.service');
const generateTicketSuggestions = async (req, res, next) => {
    console.log('inside controller');
    
    try {
        const { description } = req.body;

        // Validate the request before calling OpenAI.
        if (
            typeof description !== 'string' ||
            !description.trim() ||
            description.trim().length > 3000
        ) {
            return res.status(400).json({
                message: 'Description is required and must not exceed 3000 characters.'
            });
        }

        const suggestions =
            await aiService.generateTicketSuggestions(
                description.trim()
            );

        return res.status(200).json({
            message: 'Ticket suggestions generated successfully.',
            data: suggestions
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {generateTicketSuggestions}
