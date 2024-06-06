const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

// Configurar el servicio de correo electrónico (nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'siseveca@gmail.com',
        pass: '03101998Temuco/*-+.'
    }
});

const sendEmail = async (subject, text) => {
    const dataPath = path.join(__dirname, '..', 'data', 'roommates.json');
    const roommates = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const emailList = roommates.map(r => r.email); // Asumiendo que cada roommate tiene un campo 'email'

    const mailOptions = {
        from: 'siseveca@gmail.com',
        to: emailList.join(','),
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Controlador para obtener todos los gastos
router.get('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json({ gastos: JSON.parse(data) });
    } catch (error) {
        res.status(500).json({ error: 'Error reading expenses data' });
    }
});

// Controlador para agregar un nuevo gasto
router.post('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    try {
        let gastos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const newGasto = {
            id: uuidv4(),
            ...req.body
        };

        gastos.push(newGasto);
        fs.writeFileSync(dataPath, JSON.stringify(gastos));

        // Enviar correo electrónico
        sendEmail('Nuevo gasto registrado', `Se ha registrado un nuevo gasto: ${newGasto.descripcion} por ${newGasto.monto}`);

        res.status(201).json(newGasto);
    } catch (error) {
        res.status(500).json({ error: 'Error adding new expense' });
    }
});

// Controlador para eliminar un gasto
router.delete('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    try {
        let gastos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const updatedGastos = gastos.filter(g => g.id !== req.query.id);

        if (updatedGastos.length !== gastos.length) {
            fs.writeFileSync(dataPath, JSON.stringify(updatedGastos));
            res.status(200).json({ message: 'Expense deleted' });
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting expense' });
    }
});

// Controlador para editar un gasto
const updateExpense = (req, res) => {
    const { id } = req.query;
    const updatedExpense = req.body;

    console.log('ID:', id);  // Verifica que el ID se esté recibiendo correctamente
    console.log('Updated Expense:', updatedExpense);  // Verifica que el cuerpo de la solicitud se esté recibiendo correctamente

    fs.readFile(path.join(__dirname, '../data/gastos.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading expenses file');
            return;
        }

        let expenses = JSON.parse(data);
        const expenseIndex = expenses.findIndex(e => e.id === id);

        console.log('Expense Index:', expenseIndex);  // Verifica que el índice se encuentre correctamente

        if (expenseIndex === -1) {
            res.status(404).send('Expense not found');
            return;
        }

        // Mantener el ID y combinar con los datos nuevos
        expenses[expenseIndex] = { ...expenses[expenseIndex], ...updatedExpense };

        fs.writeFile(path.join(__dirname, '../data/gastos.json'), JSON.stringify(expenses, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing to expenses file');
                return;
            }

            res.status(200).send(expenses[expenseIndex]);
        });
    });
};

router.put('/', updateExpense);

module.exports = router;
