const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Controlador para obtener roommates
router.get('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'roommates.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    res.json({ roommates: JSON.parse(data) });
});

// Controlador para agregar un nuevo roommate
router.post('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'roommates.json');
    let roommates = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const newRoommate = {
        id: uuidv4(),
        nombre: `Roommate-${new Date().getTime()}`,
        debe: 0,
        recibe: 0
    };

    roommates.push(newRoommate);
    fs.writeFileSync(dataPath, JSON.stringify(roommates));
    res.status(201).json(newRoommate);
});

module.exports = router;
