const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'database.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Apply schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

// Helper to build menu entries: [category, foodName, variant, price]
function item(category, foodName, variant, price) {
    const displayName = variant ? `${foodName} (${variant})` : foodName;
    return { category, food_name: foodName, variant: variant || null, display_name: displayName, price };
}

const menu = [
    // Morning Breakfast
    item('Morning Breakfast', 'Milk Coffee', null, 70),
    item('Morning Breakfast', 'Black Coffee', null, 50),
    item('Morning Breakfast', 'Milk Tea', null, 25),
    item('Morning Breakfast', 'Black Tea', null, 20),
    item('Morning Breakfast', 'Hot Lemon', null, 25),
    item('Morning Breakfast', 'Lemon Tea', null, 25),
    item('Morning Breakfast', 'Chana', null, 60),
    item('Morning Breakfast', 'Aalu Fried', null, 60),
    item('Morning Breakfast', 'Boiled Egg', null, 30),
    item('Morning Breakfast', 'Plain Omelette', null, 60),
    item('Morning Breakfast', 'Masala Omelette', null, 70),

    // Khana
    item('Khana', 'Veg Khana', null, 150),
    item('Khana', 'Buff Khana', null, 220),
    item('Khana', 'Chicken Khana', null, 220),
    item('Khana', 'Mutton Khana', null, 360),
    item('Khana', 'Omelette Khana', null, 220),

    // Chowmein
    item('Chowmein', 'Veg Chowmein', 'Full', 110),
    item('Chowmein', 'Veg Chowmein', 'Half', 55),
    item('Chowmein', 'Buff Chowmein', 'Full', 130),
    item('Chowmein', 'Buff Chowmein', 'Half', 65),
    item('Chowmein', 'Chicken Chowmein', 'Full', 150),
    item('Chowmein', 'Chicken Chowmein', 'Half', 75),
    item('Chowmein', 'Mixed Chowmein', 'Full', 180),
    item('Chowmein', 'Mixed Chowmein', 'Half', 90),
    item('Chowmein', 'Egg Chowmein', 'Full', 150),
    item('Chowmein', 'Egg Chowmein', 'Half', 75),

    // Momo
    item('Momo', 'Veg Momo', 'Steam', 110),
    item('Momo', 'Veg Momo', 'Jhol', 120),
    item('Momo', 'Veg Momo', 'Fry', 120),
    item('Momo', 'Veg Momo', 'Choila', 130),
    item('Momo', 'Veg Momo', 'Sadeko', 130),
    item('Momo', 'Veg Momo', 'C Momo', 130),
    item('Momo', 'Buff Momo', 'Steam', 130),
    item('Momo', 'Buff Momo', 'Jhol', 140),
    item('Momo', 'Buff Momo', 'Fry', 140),
    item('Momo', 'Buff Momo', 'Choila', 160),
    item('Momo', 'Buff Momo', 'Sadeko', 160),
    item('Momo', 'Buff Momo', 'C Momo', 160),
    item('Momo', 'Chicken Momo', 'Steam', 150),
    item('Momo', 'Chicken Momo', 'Jhol', 160),
    item('Momo', 'Chicken Momo', 'Fry', 160),
    item('Momo', 'Chicken Momo', 'Choila', 180),
    item('Momo', 'Chicken Momo', 'Sadeko', 180),
    item('Momo', 'Chicken Momo', 'C Momo', 180),

    // Biryani
    item('Biryani', 'Chicken Biryani', null, 220),
    item('Biryani', 'Buff Biryani', null, 220),
    item('Biryani', 'Mutton Biryani', null, 370),

    // Khaja Set
    item('Khaja Set', 'Veg Khaja Set', null, 130),
    item('Khaja Set', 'Buff Khaja Set', null, 220),
    item('Khaja Set', 'Chicken Khaja Set', null, 230),

    // Thukpa
    item('Thukpa', 'Veg Thukpa', 'Full', 120),
    item('Thukpa', 'Veg Thukpa', 'Half', 60),
    item('Thukpa', 'Buff Thukpa', 'Full', 140),
    item('Thukpa', 'Buff Thukpa', 'Half', 70),
    item('Thukpa', 'Chicken Thukpa', 'Full', 160),
    item('Thukpa', 'Chicken Thukpa', 'Half', 80),
    item('Thukpa', 'Mixed Thukpa', 'Full', 190),
    item('Thukpa', 'Mixed Thukpa', 'Half', 95),
    item('Thukpa', 'Egg Thukpa', 'Full', 160),
    item('Thukpa', 'Egg Thukpa', 'Half', 80),

    // Chauchau
    item('Chauchau', 'Fried Chauchau', 'Full', 100),
    item('Chauchau', 'Fried Chauchau', 'Half', 50),
    item('Chauchau', 'Jhol Chauchau', 'Full', 100),
    item('Chauchau', 'Jhol Chauchau', 'Half', 50),
    item('Chauchau', 'Egg Chauchau', 'Full', 130),
    item('Chauchau', 'Egg Chauchau', 'Half', 65),
    item('Chauchau', 'Chicken Chauchau', 'Full', 130),
    item('Chauchau', 'Chicken Chauchau', 'Half', 65),

    // Snacks
    item('Snacks', 'Chicken Chilly', 'Full', 250),
    item('Snacks', 'Chicken Chilly', 'Half', 125),
    item('Snacks', 'Buff Chilly', 'Full', 230),
    item('Snacks', 'Buff Chilly', 'Half', 115),
    item('Snacks', 'Chicken Sukuti Sadeko', 'Full', 250),
    item('Snacks', 'Chicken Sukuti Sadeko', 'Half', 125),
    item('Snacks', 'Buff Sukuti Sadeko', 'Full', 230),
    item('Snacks', 'Buff Sukuti Sadeko', 'Half', 115),
    item('Snacks', 'Aalu Sadeko', null, 100),
    item('Snacks', 'Bhatmas Sadeko', null, 100),
    item('Snacks', 'Peanut Sadeko', null, 120),
    item('Snacks', 'Sausage Chilly', 'Full', 250),
    item('Snacks', 'Sausage Chilly', 'Half', 125),
    item('Snacks', 'Chicken Sausage', null, 50),
    item('Snacks', 'Fry Buff Sausage', null, 40),
    item('Snacks', 'Boiled Sausage', null, 40),
    item('Snacks', 'Chips Chilly', 'Full', 150),
    item('Snacks', 'Chips Chilly', 'Half', 75),
    item('Snacks', 'French Fry', 'Full', 100),
    item('Snacks', 'French Fry', 'Half', 50),
    item('Snacks', 'Aalu Stick', null, 35),
    item('Snacks', 'Drum Stick', null, 50),
    item('Snacks', 'Leg Piece', null, 150),
    item('Snacks', 'Veg Pakoda', 'Full', 150),
    item('Snacks', 'Veg Pakoda', 'Half', 75),
    item('Snacks', 'Egg Pakoda', 'Full', 200),
    item('Snacks', 'Egg Pakoda', 'Half', 100),
    item('Snacks', 'Cheese Pakoda', 'Full', 250),
    item('Snacks', 'Cheese Pakoda', 'Half', 125),
    item('Snacks', 'Meat Ball', 'Full', 250),
    item('Snacks', 'Meat Ball', 'Half', 125),
    item('Snacks', 'Chicken Sewale', null, 80),
    item('Snacks', 'Buff Sewale', null, 70),

    // Burger
    item('Burger', 'Cheese Burger', null, 180),
    item('Burger', 'Veg Burger', null, 130),
    item('Burger', 'Chicken Burger', null, 150),
    item('Burger', 'Mixed Burger', null, 200),
    item('Burger', 'Ham Burger', null, 140),

    // Sandwich
    item('Sandwich', 'Veg Sandwich', null, 130),
    item('Sandwich', 'Chicken Sandwich', null, 150),
    item('Sandwich', 'Mixed Sandwich', null, 200),
    item('Sandwich', 'Egg Sandwich', null, 150),

    // Pizza
    item('Pizza', 'Cheese Pizza', null, 300),
    item('Pizza', 'Buff Pizza', null, 350),
    item('Pizza', 'Chicken Pizza', null, 350),
    item('Pizza', 'Mixed Pizza', null, 400),
    item('Pizza', 'Sausage Pizza', null, 350),

    // Fried Rice
    item('Fried Rice', 'Veg Fried Rice', 'Full', 120),
    item('Fried Rice', 'Veg Fried Rice', 'Half', 60),
    item('Fried Rice', 'Buff Fried Rice', 'Full', 150),
    item('Fried Rice', 'Buff Fried Rice', 'Half', 75),
    item('Fried Rice', 'Chicken Fried Rice', 'Full', 160),
    item('Fried Rice', 'Chicken Fried Rice', 'Half', 80),
    item('Fried Rice', 'Mixed Fried Rice', 'Full', 180),
    item('Fried Rice', 'Mixed Fried Rice', 'Half', 90),
    item('Fried Rice', 'Egg Fried Rice', 'Full', 150),
    item('Fried Rice', 'Egg Fried Rice', 'Half', 75),

    // Cold Drinks
    item('Cold Drinks', 'Coke', null, 70),
    item('Cold Drinks', 'Fanta', null, 70),
    item('Cold Drinks', 'Sprite', null, 70),
    item('Cold Drinks', 'Pepsi', null, 70),
    item('Cold Drinks', 'Slice', null, 70),
    item('Cold Drinks', 'Red Bull', null, 130),
    item('Cold Drinks', 'Xtreme R Bull', null, 150),
    item('Cold Drinks', 'Frooti', null, 35),
    item('Cold Drinks', 'Appy', null, 35),
    item('Cold Drinks', 'Mineral Water', null, 25),

    // Cigarette
    item('Cigarette', 'Surya', null, 25),
    item('Cigarette', 'Shikhar', null, 20),
    item('Cigarette', 'Captain', null, 15),
    item('Cigarette', 'Pilot', null, 10),
];

const countRow = db.prepare('SELECT COUNT(*) AS c FROM menu_items').get();

if (countRow.c === 0) {
    const insert = db.prepare(`
        INSERT INTO menu_items (category, food_name, variant, display_name, price)
        VALUES (@category, @food_name, @variant, @display_name, @price)
    `);
    const insertMany = db.transaction((items) => {
        for (const it of items) insert.run(it);
    });
    insertMany(menu);
    console.log(`Seeded ${menu.length} menu items.`);
} else {
    console.log(`Menu already has ${countRow.c} items. Skipping seed.`);
}

module.exports = db;
