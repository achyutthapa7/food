const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Ensure DB + schema + menu seed exist before the app starts serving requests
require('./database/seed');

const eventRoutes = require('./routes/eventRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars setup
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: [
        path.join(__dirname, 'views/partials'),
        path.join(__dirname, 'views/components'),
    ],
    helpers: {
        eq: (a, b) => a === b,
        formatMoney: (v) => Number(v || 0).toFixed(2),
        formatDate: (d) => {
            if (!d) return '';
            const date = new Date(d);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        },
        formatTime: (d) => {
            if (!d) return '';
            const date = new Date(d.includes('Z') ? d : d + 'Z');
            return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        },
        json: (context) => JSON.stringify(context),
        inc: (v) => Number(v) + 1,
    },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', eventRoutes);
app.use('/', orderRoutes);
app.use('/', dashboardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong. Please try again.');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food Order System running at:`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Network: http://<your-ip-address>:${PORT}`);
});
