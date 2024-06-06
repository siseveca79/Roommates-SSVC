const fetch = require('node-fetch');

const getRandomUser = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
        return {
            nombre: `${user.name.first} ${user.name.last}`,
            debe: Math.floor(Math.random() * 10000),
            recibe: Math.floor(Math.random() * 10000)
        };
    } catch (error) {
        console.error('Error fetching random user:', error);
        throw error;
    }
};

module.exports = getRandomUser;
