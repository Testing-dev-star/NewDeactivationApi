const express = require('express');
const bodyParser = require('body-parser');
const { deployTriggerState } = require('./salesforceService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/toggle-trigger', async (req, res) => {
    const { username, password, clientId, clientSecret, loginUrl, triggerName, activate } = req.body;

    if (!username || !password || !clientId || !clientSecret || !loginUrl || !triggerName) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    try {
        const result = await deployTriggerState({ username, password, clientId, clientSecret, loginUrl, triggerName, activate });
        res.json({ message: `Trigger ${triggerName} ${activate ? 'activated' : 'deactivated'} successfully.`, details: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
