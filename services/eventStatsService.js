const OrderModel = require('../models/orderModel');

// Attach participant/amount totals to a list of events (for the homepage cards)
function attachEventStats(events) {
    return events.map((event) => {
        const summary = OrderModel.getEventSummary(event.id);
        return {
            ...event,
            total_participants: summary.participants,
            total_actual: summary.total_actual,
            total_eligible: summary.total_eligible,
        };
    });
}

module.exports = { attachEventStats };
