const fetch = require('node-fetch');

const getRandomUser = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
        return {
            id: user.login.uuid,
            nombre: `${user.name.first} ${user.name.last}`,
            debe: 0,
            recibe: 0
        };
    } catch (error) {
        throw new Error('Failed to fetch random user');
    }
};

module.exports = { getRandomUser };
