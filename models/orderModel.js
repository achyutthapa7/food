const db = require('./db');

const OrderModel = {
    // Orders for an event, optionally filtered by group/search, latest first
    getByEvent(eventId, filters = {}) {
        let query = `
            SELECT o.*, m.display_name, m.category
            FROM orders o
            JOIN menu_items m ON m.id = o.menu_item_id
            WHERE o.event_id = ?
        `;
        const params = [eventId];

        if (filters.group_no) {
            query += ' AND o.group_no = ?';
            params.push(filters.group_no);
        }
        if (filters.name) {
            query += ' AND o.visitor_name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.food) {
            query += ' AND m.display_name LIKE ?';
            params.push(`%${filters.food}%`);
        }

        query += ' ORDER BY o.created_at DESC, o.id DESC';

        return db.prepare(query).all(...params);
    },

    getById(id) {
        return db.prepare(`
            SELECT o.*, m.display_name, m.category
            FROM orders o
            JOIN menu_items m ON m.id = o.menu_item_id
            WHERE o.id = ?
        `).get(id);
    },

    create({ event_id, visitor_name, group_no, menu_item_id, actual_price, eligible_price }) {
        const result = db.prepare(`
            INSERT INTO orders (event_id, visitor_name, group_no, menu_item_id, actual_price, eligible_price)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(event_id, visitor_name, group_no, menu_item_id, actual_price, eligible_price);
        return this.getById(result.lastInsertRowid);
    },

    update(id, { group_no, menu_item_id, actual_price, eligible_price }) {
        db.prepare(`
            UPDATE orders
            SET group_no = ?, menu_item_id = ?, actual_price = ?, eligible_price = ?
            WHERE id = ?
        `).run(group_no, menu_item_id, actual_price, eligible_price, id);
        return this.getById(id);
    },

    delete(id) {
        return db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    },

    // Summary totals for one group within an event
    getGroupSummary(eventId, groupNo) {
        return db.prepare(`
            SELECT
                COUNT(*) AS participants,
                COALESCE(SUM(actual_price), 0) AS total_actual,
                COALESCE(SUM(eligible_price), 0) AS total_eligible
            FROM orders
            WHERE event_id = ? AND group_no = ?
        `).get(eventId, groupNo);
    },

    // Summary totals for an entire event (both groups combined)
    getEventSummary(eventId) {
        return db.prepare(`
            SELECT
                COUNT(*) AS participants,
                COALESCE(SUM(actual_price), 0) AS total_actual,
                COALESCE(SUM(eligible_price), 0) AS total_eligible
            FROM orders
            WHERE event_id = ?
        `).get(eventId);
    },

    // Dashboard-wide grand totals across all events (or just today's)
    getGrandTotals() {
        return db.prepare(`
            SELECT
                COUNT(*) AS participants,
                COALESCE(SUM(actual_price), 0) AS total_actual,
                COALESCE(SUM(eligible_price), 0) AS total_eligible
            FROM orders
        `).get();
    },
};

module.exports = OrderModel;
