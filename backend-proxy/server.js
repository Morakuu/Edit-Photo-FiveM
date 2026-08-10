require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
    res.send('EMS Backend Proxy is running!');
});

// ----------------------------------------------------
// GITHUB API PROXY (Online Users)
// ----------------------------------------------------
const GITHUB_REPO_URL = "https://api.github.com/repos/Morakuu/EMS-APP/contents/online_users.json";

// GET Online Users
app.get('/api/github/online_users', async (req, res) => {
    try {
        const response = await axios.get(`${GITHUB_REPO_URL}?t=${Date.now()}`, {
            headers: {
                "Authorization": `token ${process.env.GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching online users:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to fetch from GitHub" });
    }
});

// PUT Online Users
app.put('/api/github/online_users', async (req, res) => {
    try {
        const { message, content, sha } = req.body;
        
        const response = await axios.put(GITHUB_REPO_URL, {
            message: message,
            content: content,
            sha: sha
        }, {
            headers: {
                "Authorization": `token ${process.env.GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error updating online users:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to update GitHub" });
    }
});

// ----------------------------------------------------
// DISCORD WEBHOOK PROXY
// ----------------------------------------------------

// POST Webhook (Logging / Active Users)
app.post('/api/discord/webhook', async (req, res) => {
    try {
        const { type, payload } = req.body;
        let webhookUrl = '';

        if (type === 'active_users') {
            webhookUrl = process.env.DISCORD_ACTIVE_USERS_WEBHOOK;
        } else if (type === 'admin_log') {
            webhookUrl = process.env.DISCORD_ADMIN_LOG_WEBHOOK;
        } else {
            return res.status(400).json({ error: "Invalid webhook type" });
        }

        if (!webhookUrl) {
             return res.status(500).json({ error: "Webhook URL not configured on server" });
        }

        const response = await axios.post(webhookUrl, payload);
        res.json({ success: true });
    } catch (error) {
        console.error("Error sending to Discord:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to send to Discord" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
