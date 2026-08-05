const db = require('./db');

const MenuModel = {
    getAll() {
        return db.prepare('SELECT * FROM menu_items ORDER BY category, display_name').all();
    },

    getById(id) {
        return db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    },

    getGroupedByCategory() {
        const items = this.getAll();
        const grouped = {};
        for (const it of items) {
            if (!grouped[it.category]) grouped[it.category] = [];
            grouped[it.category].push(it);
        }
        return Object.keys(grouped).map((category) => ({
            category,
            items: grouped[category],
        }));
    },
};

module.exports = MenuModel;
