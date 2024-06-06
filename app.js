const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const roommatesRoutes = require('./routes/roommates');
const expensesRoutes = require('./routes/expenses');
const { sendEmail } = require('./services/emailService'); // Importar el servicio de correo

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para enviar un correo de prueba
app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    sendEmail(to, subject, text);
    res.send('Email enviado');
});

app.use('/roommate', roommatesRoutes);
app.use('/gasto', expensesRoutes);

app.listen(PORT, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${PORT}`);
});
