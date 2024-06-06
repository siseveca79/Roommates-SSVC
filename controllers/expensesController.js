const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const getExpenses = (req, res) => {
    fs.readFile(path.join(__dirname, '../data/gastos.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading expenses file');
            return;
        }
        res.send(JSON.parse(data));
    });
};

const addExpense = (req, res) => {
    fs.readFile(path.join(__dirname, '../data/gastos.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading expenses file');
            return;
        }
        const expenses = JSON.parse(data);
        const newExpense = { id: uuidv4(), ...req.body };
        expenses.push(newExpense);
        fs.writeFile(path.join(__dirname, '../data/gastos.json'), JSON.stringify(expenses, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing to expenses file');
                return;
            }
            res.status(201).send(newExpense);
        });
    });
};

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
        const expenses = JSON.parse(data);
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

const deleteExpense = (req, res) => {
    const { id } = req.query;
    fs.readFile(path.join(__dirname, '../data/gastos.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading expenses file');
            return;
        }
        let expenses = JSON.parse(data);
        expenses = expenses.filter(e => e.id !== id);
        fs.writeFile(path.join(__dirname, '../data/gastos.json'), JSON.stringify(expenses, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing to expenses file');
                return;
            }
            res.status(200).send({ message: 'Expense deleted' });
        });
    });
};

// Renombrar a editGasto si esta es la función que actualiza el registro
const editGasto = updateExpense;

module.exports = { getExpenses, addExpense, updateExpense: editGasto, deleteExpense };
