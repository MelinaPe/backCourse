const Ticket = require('../models/ticket');

class TicketService {
    async createTicket(ticketData) {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return ticket;
    }
}

module.exports = TicketService;
