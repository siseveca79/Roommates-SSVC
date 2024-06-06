const axios = require('axios');

const getRandomUser = async () => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    const user = response.data.results[0];
    return {
      nombre: `${user.name.first} ${user.name.last}`,
      debe: 0,
      recibe: 0,
    };
  } catch (error) {
    throw new Error('Error al obtener el usuario aleatorio');
  }
};

module.exports = { getRandomUser };
