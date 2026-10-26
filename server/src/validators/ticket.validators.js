

// create ticket payload vloidator //
const validateCreateTicket = (req, res, next) => {
    const { title, description, categoryId, priorityId } = req.body;

    if (
        typeof title !== 'string' ||
        !title.trim()
    ) {
        return res.status(400).json({
            message: 'Title is required'
        });
    }

    if (
        typeof description !== 'string' ||
        !description.trim()
    ) {
        return res.status(400).json({
            message: 'Description is required'
        });
    }

    if (!Number.isInteger(Number(categoryId))) {
        return res.status(400).json({
            message: 'Valid categoryId is required'
        });
    }

    if (!Number.isInteger(Number(priorityId))) {
        return res.status(400).json({
            message: 'Valid priorityId is required'
        });
    }

    if (title.trim().length > 200) {
        return res.status(400).json({
            message: 'Title cannot exceed 200 characters'
        });
    }

     next();
};

/// serach ticket api payload validators//
const { DATE_RANGES } = require('../constants/ticket.constants');

const ALLOWED_FILTERS = [
  'statusIds',
  'priorityIds',
  'categoryIds',
  'teamIds',
  'assignedToIds',
];

function validateTicketSearch(req, res, next) {
  const {
    page,
    limit,
    dateRange,
    search 
  } = req.body; // need to change later

  const errors = [];

  if (!Number.isSafeInteger(page) || page < 1) {
    errors.push('page must be a positive integer');
  }

  if (
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    errors.push('limit must be between 1 and 100');
  }

  const allowedDateRanges = Object.values(DATE_RANGES); // need to change later

  if (!allowedDateRanges.includes(dateRange)) {
    errors.push('Invalid dateRange');
  }

  if (typeof search !== 'string') {
    errors.push('search must be a string');
  }

  const filters = {};

  for (const key of ALLOWED_FILTERS) {
    const value = req.body[key];

    if (value === undefined || value === null) {
      filters[key] = [];
      continue;
    }

    if (!Array.isArray(value)) {
      errors.push(`${key} must be an array`);
      continue;
    }

    if (
      !value.every(
        id => Number.isSafeInteger(id) && id > 0
      )
    ) {
      errors.push(
        `${key} must contain positive integer IDs`
      );
      continue;
    }

    // Remove duplicate IDs.
    filters[key] = [...new Set(value)];
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ticket search filters',
      errors,
    });
  }

  req.ticketSearch = {
    page,
    limit,
    dateRange,
    search: search.trim(),
    ...filters,
  };

  next();
}


module.exports = {
    validateCreateTicket,
    validateTicketSearch
};