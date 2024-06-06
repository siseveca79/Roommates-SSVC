const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const { getRandomUser } = require('../helpers/getRandomUser');

const getRoommates = (req, res) => {
    fs.readFile(path.join(__dirname, '../data/roommates.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading roommates file');
            return;
        }
        res.send(JSON.parse(data));
    });
};

const addRoommate = async (req, res) => {
    try {
        const newUser = await getRandomUser();
        fs.readFile(path.join(__dirname, '../data/roommates.json'), 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading roommates file');
                return;
            }
            const roommates = JSON.parse(data);
            roommates.push(newUser);
            fs.writeFile(path.join(__dirname, '../data/roommates.json'), JSON.stringify(roommates, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error writing to roommates file');
                    return;
                }
                res.status(201).send(newUser);
            });
        });
    } catch (error) {
        res.status(500).send('Error fetching random user');
    }
};

module.exports = { getRoommates, addRoommate };
