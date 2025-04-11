const axios = require('axios');

async function pushToWordPress(pageData, wpConfig) {
  try {
    const response = await axios.post(`${wpConfig.url}/wp-json/wp/v2/pages`, pageData, {
      headers: {
        'Authorization': `Bearer ${wpConfig.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error syncing with WordPress:', error.message);
    throw error;
  }
}

module.exports = { pushToWordPress };
