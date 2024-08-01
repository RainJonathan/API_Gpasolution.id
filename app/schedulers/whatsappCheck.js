const cron = require('node-cron');
const axios = require('axios');

function start() {
    // Schedule the task to run every hour
    cron.schedule('*/5 * * * * *', () => {
        console.log('Calling API every 1 hour');
        callApi();
    });
}
//'*/10 * * * * *'
//'0 * * * * *'

// Function to call the API and log data
async function callApi() {
    try {
        const response = await axios.post('http://localhost:5001/whatsapp/asset-alert', {
            session: 'mysession'
        });
        console.log('API response:', response.data);
    } catch (error) {
        console.error('Error calling API:', error);
    }
}

//'https://api.gpasolution.id/whatsapp/asset-alert'
module.exports = { start };
