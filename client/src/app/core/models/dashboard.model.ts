
export type DashboardRole =
    | 'ADMIN'
    | 'MANAGER'
    | 'SUPPORT_AGENT'
    | 'CUSTOMER';

export interface DashboardSummary {
    totalTickets?: number;
    openTickets?: number;
    resolvedTickets?: number;

    teamTickets?: number;
    unassignedTickets?: number;

    assignedToMe?: number;
    highPriorityTickets?: number;

    myTickets?: number;
}

export interface RecentTicket {
    id: number;
    ticket_number: string;
    title: string;
    status_code: string;
    status_name: string;
    priority_code: string;
    priority_name: string;
    category_name: string;
    created_at: string;
    updated_at: string;
}

export interface DashboardData {
    effectiveRole: DashboardRole;
    summary: DashboardSummary;
    recentTickets: RecentTicket[];
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardData;
}
