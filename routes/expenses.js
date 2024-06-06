const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Controlador para obtener gastos
router.get('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    res.json({ gastos: JSON.parse(data) });
});

// Controlador para agregar un nuevo gasto
router.post('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    let gastos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const newGasto = {
        id: new Date().getTime().toString(),
        roommate: req.body.roommate,
        descripcion: req.body.descripcion,
        monto: req.body.monto
    };

    gastos.push(newGasto);
    fs.writeFileSync(dataPath, JSON.stringify(gastos));
    res.status(201).json(newGasto);
});

// Controlador para eliminar un gasto
router.delete('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    let gastos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    gastos = gastos.filter(g => g.id !== req.query.id);
    fs.writeFileSync(dataPath, JSON.stringify(gastos));
    res.status(200).json({ message: 'Gasto eliminado' });
});

// Controlador para actualizar un gasto
router.put('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'gastos.json');
    let gastos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const index = gastos.findIndex(g => g.id === req.query.id);
    if (index !== -1) {
        gastos[index] = {
            id: req.query.id,
            roommate: req.body.roommate,
            descripcion: req.body.descripcion,
            monto: req.body.monto
        };
        fs.writeFileSync(dataPath, JSON.stringify(gastos));
        res.status(200).json(gastos[index]);
    } else {
        res.status(404).json({ message: 'Gasto no encontrado' });
    }
});

module.exports = router;
