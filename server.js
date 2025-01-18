const express = require('express');
const app = express();

app.use(express.json());

// Store scripts and execution tracking
let playerScripts = {};
let globalScript = {
    script: null,
    executedPlayers: new Set() // Tracks players who executed the current global script
};

// Route to handle scripts sent from Discord
app.post('/command', (req, res) => {
    const { action, playerId, script } = req.body;

    if (action === 'execute_script' && playerId && script) {
        console.log(`Received script for Player ${playerId}: ${script}`);
        playerScripts[playerId] = script; // Save the script for the player
        return res.status(200).json({ message: `Script received for Player ${playerId}.` });
    }

    if (action === 'execute_global_script' && script) {
        console.log(`Received global script: ${script}`);
        globalScript = { script, executedPlayers: new Set() }; // Reset global script and tracking
        return res.status(200).json({ message: "Global script received and stored." });
    }

    if (action === 'fetch_script' && playerId) {
        // Player-specific script
        if (playerScripts[playerId]) {
            const scriptToSend = playerScripts[playerId];
            delete playerScripts[playerId]; // Clear the player-specific script after sending
            console.log(`Sending script to Player ${playerId}: ${scriptToSend}`);
            return res.status(200).json({ script: scriptToSend });
        }
        // Global script for unexecuted players
        else if (globalScript.script && !globalScript.executedPlayers.has(playerId)) {
            globalScript.executedPlayers.add(playerId); // Mark this player as having executed the global script
            console.log(`Sending global script to Player ${playerId}: ${globalScript.script}`);
            return res.status(200).json({ script: globalScript.script });
        } else {
            console.log(`No script available for Player ${playerId}.`);
            return res.status(200).json({ script: null });
        }
    }

    res.status(400).json({ error: "Invalid action or missing parameters" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Middleware running on port ${PORT}`);
});
