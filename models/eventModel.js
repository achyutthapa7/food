const db = require('./db');

const EventModel = {
    getAll() {
        return db.prepare('SELECT * FROM events ORDER BY event_date DESC').all();
    },

    getById(id) {
        return db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    },

    getByDate(dateStr) {
        return db.prepare('SELECT * FROM events WHERE event_date = ?').get(dateStr);
    },

    create({ title, description, event_date }) {
        const result = db.prepare(
            'INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)'
        ).run(title, description || null, event_date);
        return this.getById(result.lastInsertRowid);
    },

    // Find today's event, or create one automatically if it doesn't exist
    getOrCreateToday() {
        const today = new Date();
        const isoDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

        let event = this.getByDate(isoDate);
        if (event) return event;

        const formatted = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
        const title = `Lunch - ${formatted}`;

        return this.create({ title, description: 'Auto-created daily event', event_date: isoDate });
    },

    delete(id) {
        return db.prepare('DELETE FROM events WHERE id = ?').run(id);
    },
};

module.exports = EventModel;
