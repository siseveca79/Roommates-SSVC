const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const roommatesRoutes = require('./routes/roommates');
const expensesRoutes = require('./routes/expenses');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:3000' })); // Habilitar CORS para todas las rutas
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/roommate', roommatesRoutes);
app.use('/gasto', expensesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
