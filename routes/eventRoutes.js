const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const exportController = require('../controllers/exportController');

router.get('/', eventController.listEvents);
router.get('/events/new', eventController.showCreateForm);
router.post('/events', eventController.createEvent);
router.get('/events/:id', eventController.showEvent);
router.get('/events/:id/export', exportController.exportEventExcel);

module.exports = router;
