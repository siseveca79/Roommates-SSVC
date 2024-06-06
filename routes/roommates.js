const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const getRandomUser = require('../helpers/getRandomUser');

// Controlador para obtener roommates
router.get('/', (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'roommates.json');
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json({ roommates: JSON.parse(data) });
    } catch (error) {
        res.status(500).json({ error: 'Error reading roommates data' });
    }
});

// Controlador para agregar un nuevo roommate
router.post('/', async (req, res) => {
    const dataPath = path.join(__dirname, '..', 'data', 'roommates.json');
    try {
        let roommates = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const newRoommate = await getRandomUser();
        newRoommate.id = uuidv4();

        roommates.push(newRoommate);
        fs.writeFileSync(dataPath, JSON.stringify(roommates));
        res.status(201).json(newRoommate);
    } catch (error) {
        res.status(500).json({ error: 'Error adding new roommate' });
    }
});

module.exports = router;
