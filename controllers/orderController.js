const OrderModel = require('../models/orderModel');
const MenuModel = require('../models/menuModel');
const EventModel = require('../models/eventModel');
const { calculateEligible } = require('../services/calculationService');

function validateOrderInput(body) {
    const errors = [];
    if (!body.visitor_name || !body.visitor_name.trim()) errors.push('Name is required.');
    if (!body.group_no || ![1, 2].includes(Number(body.group_no))) errors.push('Group must be 1 or 2.');
    if (!body.menu_item_id) errors.push('Food item is required.');
    return errors;
}

const orderController = {
    createOrder(req, res) {
        const eventId = Number(req.params.eventId);
        const event = EventModel.getById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const errors = validateOrderInput(req.body);
        if (errors.length) return res.status(400).json({ error: errors.join(' ') });

        const menuItem = MenuModel.getById(Number(req.body.menu_item_id));
        if (!menuItem) return res.status(400).json({ error: 'Invalid food item.' });

        const actualPrice = menuItem.price;
        const eligiblePrice = calculateEligible(actualPrice);

        const order = OrderModel.create({
            event_id: eventId,
            visitor_name: req.body.visitor_name.trim(),
            group_no: Number(req.body.group_no),
            menu_item_id: menuItem.id,
            actual_price: actualPrice,
            eligible_price: eligiblePrice,
        });

        if (req.headers['content-type']?.includes('application/json') || req.xhr) {
            return res.status(201).json({ order });
        }
        res.redirect(`/events/${eventId}`);
    },

    updateOrder(req, res) {
        const orderId = Number(req.params.id);
        const existing = OrderModel.getById(orderId);
        if (!existing) return res.status(404).json({ error: 'Order not found' });

        const errors = validateOrderInput({ ...existing, ...req.body });
        if (errors.length) return res.status(400).json({ error: errors.join(' ') });

        const menuItem = MenuModel.getById(Number(req.body.menu_item_id));
        if (!menuItem) return res.status(400).json({ error: 'Invalid food item.' });

        const actualPrice = menuItem.price;
        const eligiblePrice = calculateEligible(actualPrice);

        const order = OrderModel.update(orderId, {
            group_no: Number(req.body.group_no),
            menu_item_id: menuItem.id,
            actual_price: actualPrice,
            eligible_price: eligiblePrice,
        });

        if (req.headers['content-type']?.includes('application/json') || req.xhr) {
            return res.json({ order });
        }
        res.redirect(`/events/${existing.event_id}`);
    },

    deleteOrder(req, res) {
        const orderId = Number(req.params.id);
        const existing = OrderModel.getById(orderId);
        if (!existing) return res.status(404).json({ error: 'Order not found' });

        OrderModel.delete(orderId);

        if (req.xhr) return res.json({ success: true });
        res.redirect(`/events/${existing.event_id}`);
    },
};

module.exports = orderController;
