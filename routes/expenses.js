const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

        res.status(201).json(newGasto);
    } catch (error) {
        res.status(500).json({ error: 'Error adding new expense' });
    }
});

// Controlador para eliminar un gasto
router.delete('/', (req, res) => {
    const { id } = req.query;
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    try {
        let gastos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const updatedGastos = gastos.filter(g => g.id !== id);

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
router.put('/', (req, res) => {
    const { id } = req.query;
    const updatedGasto = req.body;

    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    try {
        let gastos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const index = gastos.findIndex(g => g.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        gastos[index] = { ...gastos[index], ...updatedGasto };

        fs.writeFileSync(dataPath, JSON.stringify(gastos, null, 2)); // Escribir los datos actualizados
        res.status(200).json(gastos[index]); // Enviar el gasto actualizado
    } catch (error) {
        res.status(500).json({ error: 'Error updating expense' });
    }
});

module.exports = router;
