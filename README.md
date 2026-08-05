# Food Order System

A local office food ordering and reimbursement management system. Runs entirely on your local network — no login required.

## Tech Stack

- Node.js + Express
- Handlebars (HBS)
- SQLite (better-sqlite3)
- Bootstrap 5

## Getting Started

```bash
npm install
npm start
```

The app will be available at:

- `http://localhost:3000`
- `http://<your-machine-ip>:3000` (for other devices on the same Wi-Fi)

The SQLite database and menu are created and seeded automatically on first run — no manual setup required.

## How It Works

- **No accounts.** On first visit, each browser is asked for a name, which is stored in `localStorage`. Use "Change Name" in the navbar to reset it.
- **Daily events.** Opening the dashboard/event flow auto-joins today's event, creating it (`Lunch - DD Mon YYYY`) if it doesn't exist yet. Admins can also create future events from "New Event".
- **Ordering.** On an event page, pick a group (1 or 2) and a food item; price and eligible reimbursement (`MIN(price, 100)`) are calculated automatically.
- **Reports.** Each event page shows live totals per group and combined, and supports Excel export and print.

## Project Structure

```
food-order-system/
├── controllers/     # Request handlers
├── models/          # Database access (better-sqlite3)
├── routes/          # Express routers
├── services/         # Business logic (eligible amount calc, exports, stats)
├── database/         # schema.sql, seed.js, database.db (generated)
├── views/            # Handlebars layouts/partials/pages/components
├── public/            # CSS, JS, images
└── app.js
```

## Notes

- The database file `database/database.db` is created automatically; delete it to reset all data (the menu will reseed on next start).
- Eligible reimbursement is capped at NPR 100 per order.
