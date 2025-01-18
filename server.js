const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Store player data
const players = {};

// Endpoint to update player data
app.post('/update_player', (req, res) => {
    const { playerId, playerName, joinTime } = req.body;

    if (!playerId || !playerName || !joinTime) {
        return res.status(400).json({ error: "Missing player information" });
    }

    players[playerId] = {
        playerName,
        joinTime,
        lastUpdate: Date.now(),
    };

    console.log(`Updated player data: ${JSON.stringify(players[playerId])}`);
    res.status(200).json({ message: "Player data updated." });
});

// Endpoint to fetch all players for the dashboard
app.get('/players', (req, res) => {
    return res.status(200).json(players);
});

// Endpoint to execute commands for a specific player
app.post('/execute', (req, res) => {
    const { action, playerId, params } = req.body;

    if (!action || !playerId) {
        return res.status(400).json({ error: "Missing action or playerId" });
    }

    console.log(`Executing action: ${action} for Player ${playerId} with params: ${JSON.stringify(params)}`);
    return res.status(200).json({ message: `Action ${action} executed for Player ${playerId}.` });
});

// Serve the dashboard HTML
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Middleware running on port ${PORT}`);
});
