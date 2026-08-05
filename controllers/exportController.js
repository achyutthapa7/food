const EventModel = require('../models/eventModel');
const OrderModel = require('../models/orderModel');
const { buildEventWorkbook } = require('../services/exportService');

const exportController = {
    async exportEventExcel(req, res) {
        const eventId = Number(req.params.id);
        const event = EventModel.getById(eventId);
        if (!event) return res.status(404).send('Event not found');

        const orders = OrderModel.getByEvent(eventId);
        const groupSummaries = {
            1: OrderModel.getGroupSummary(eventId, 1),
            2: OrderModel.getGroupSummary(eventId, 2),
        };
        const eventSummary = OrderModel.getEventSummary(eventId);

        const buffer = await buildEventWorkbook(event, orders, groupSummaries, eventSummary);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="event-${eventId}-report.xlsx"`);
        res.send(buffer);
    },
};

module.exports = exportController;
