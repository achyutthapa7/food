const EventModel = require('../models/eventModel');
const OrderModel = require('../models/orderModel');
const MenuModel = require('../models/menuModel');
const { attachEventStats } = require('../services/eventStatsService');

const eventController = {
    // Homepage: list all events, newest first, with stats
    listEvents(req, res) {
        const events = attachEventStats(EventModel.getAll());
        res.render('pages/home', { title: 'Food Ordering', events });
    },

    // Root: auto-join or auto-create today's event, redirect to it
    goToToday(req, res) {
        const event = EventModel.getOrCreateToday();
        res.redirect(`/events/${event.id}`);
    },

    showCreateForm(req, res) {
        res.render('pages/event-new', { title: 'Create Event' });
    },

    createEvent(req, res) {
        const { title, description, event_date } = req.body;
        if (!title || !event_date) {
            return res.status(400).render('pages/event-new', {
                title: 'Create Event',
                error: 'Title and date are required.',
                form: req.body,
            });
        }
        try {
            const event = EventModel.create({ title, description, event_date });
            res.redirect(`/events/${event.id}`);
        } catch (err) {
            res.status(400).render('pages/event-new', {
                title: 'Create Event',
                error: 'An event already exists for that date, or the input was invalid.',
                form: req.body,
            });
        }
    },

    showEvent(req, res) {
        const eventId = Number(req.params.id);
        const event = EventModel.getById(eventId);
        if (!event) return res.status(404).send('Event not found');

        const filters = {
            group_no: req.query.group ? Number(req.query.group) : null,
            name: req.query.name || null,
            food: req.query.food || null,
        };

        const orders = OrderModel.getByEvent(eventId, filters);
        const group1Summary = OrderModel.getGroupSummary(eventId, 1);
        const group2Summary = OrderModel.getGroupSummary(eventId, 2);
        const eventSummary = OrderModel.getEventSummary(eventId);
        const menu = MenuModel.getGroupedByCategory();

        res.render('pages/event', {
            title: event.title,
            event,
            orders,
            group1Summary,
            group2Summary,
            eventSummary,
            menu,
            filters: req.query,
        });
    },
};

module.exports = eventController;
