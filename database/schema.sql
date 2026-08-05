-- Events table: one per food ordering session/day
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_date TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Menu items: predefined food catalogue
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    food_name TEXT NOT NULL,
    variant TEXT,
    display_name TEXT NOT NULL,
    price REAL NOT NULL
);

-- Orders: individual food selections tied to an event
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    visitor_name TEXT NOT NULL,
    group_no INTEGER NOT NULL DEFAULT 1,
    menu_item_id INTEGER NOT NULL,
    actual_price REAL NOT NULL,
    eligible_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_event ON orders(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_group ON orders(event_id, group_no);
