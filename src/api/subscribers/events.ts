/**
 * events
 * ---------------------
 * Define all your possible custom events here.
 */
export const events = {
    user: {
        login: 'onUserLogin',
        logout: 'onUserLogout',
        changeStatus: 'onChangeStatus',
    },
    ticket: {
        create: 'onTicketCreate',
        open: 'onTicketOpen',
        close: 'onTicketClose',
        updated: 'onTicketUpdated',
        deleted: 'onTicketDeleted',
    },
    ticketHistory: {
        create: 'onTicketHistoryCreate',
        updated: 'onTicketHistoryUpdated',
    },
    queue: {
        ticket: 'onTicketInWaiting',
        operator: 'onOperatorSessions',
    },
    calendar: {
        create: 'onTicketCreate',
        updated: 'onTicketUpdated',
        deleted: 'onTicketDeleted',
    },
};
