const EventModel = require('../models/eventModel');
const OrderModel = require('../models/orderModel');

const dashboardController = {
    showDashboard(req, res) {
        const todayEvent = EventModel.getOrCreateToday();
        const group1Summary = OrderModel.getGroupSummary(todayEvent.id, 1);
        const group2Summary = OrderModel.getGroupSummary(todayEvent.id, 2);
        const eventSummary = OrderModel.getEventSummary(todayEvent.id);

        res.render('pages/dashboard', {
            title: 'Dashboard',
            todayEvent,
            group1Summary,
            group2Summary,
            eventSummary,
        });
    },
};

module.exports = dashboardController;
