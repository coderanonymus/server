const express = require('express');
const app = express();

app.use(express.json());

// Store the latest script to be executed
let latestScript = null;

// Route to handle scripts sent from Discord
app.post('/command', (req, res) => {
    const { action, script } = req.body;

    // Handle "execute_script" action from Discord
    if (action === 'execute_script' && script) {
        console.log(`Received script from Discord: ${script}`);
        latestScript = script; // Save the script
        return res.status(200).json({ message: "Script received and stored." });
    }

    // Handle "fetch_script" action for Roblox
    if (action === 'fetch_script') {
        if (latestScript) {
            const scriptToSend = latestScript;
            latestScript = null; // Clear the script after sending
            console.log(`Sending script to Roblox: ${scriptToSend}`);
            res.setHeader('Content-Type', 'application/json'); // Explicitly set header
            return res.status(200).json({ script: scriptToSend });
        } else {
            console.log("No script available to send.");
            res.setHeader('Content-Type', 'application/json'); // Explicitly set header
            return res.status(200).json({ script: null });
        }
    }

    // Handle invalid or missing parameters
    console.error("Invalid action or missing parameters:", req.body);
    res.status(400).json({ error: "Invalid action or missing parameters" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Middleware running on port ${PORT}`);
});
