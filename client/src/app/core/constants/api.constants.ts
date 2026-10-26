export const API_ENDPOINTS={
    AUTH:{
        LOGIN:'/auth/login',
        REGISTER:'/auth/register',
        AUTHCONTEXT:'/auth/me'
    },

    DASHBOARD: {
        SUMMARY: '/dashboard/summary'
    },

    TICKETS: {
        CATEGORIES: '/tickets/categories',
        PRIORITIES: '/tickets/priorities',
        STATUSES: '/tickets/statuses',
        CREATE: '/tickets/create-ticket',
        SEARCH: '/tickets/search'
  }
} as const;