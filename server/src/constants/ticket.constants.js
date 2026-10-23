const DATE_RANGES = {
    TODAY: 'TODAY',
    LAST_7_DAYS: 'LAST_7_DAYS',
    LAST_30_DAYS: 'LAST_30_DAYS',
    LAST_90_DAYS: 'LAST_90_DAYS',
    CUSTOM: 'CUSTOM'
};

const ROLE_PRIORITY = [
    'ADMIN',
    'MANAGER',
    'AGENT',
    'SUPPORT_AGENT',
    'CUSTOMER'
];

module.exports = {
    DATE_RANGES,
    ROLE_PRIORITY
};