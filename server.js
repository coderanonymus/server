const express = require('express');
const app = express();

app.use(express.json());

// Store the latest script to be executed
let latestScript = null;

// Route to handle Discord commands
app.post('/command', (req, res) => {
    const { action, script } = req.body;

    if (action === 'execute_script' && script) {
        console.log(`Received script from Discord: ${script}`);
        latestScript = script; // Store the script for Roblox to fetch
        return res.status(200).json({ message: "Script received and ready for execution." });
    }

    if (action === 'fetch_script') {
        if (latestScript) {
            const scriptToSend = latestScript;
            latestScript = null; // Clear the script after fetching to avoid duplicate execution
            return res.status(200).json({ script: scriptToSend });
        } else {
            return res.status(200).json({ script: null }); // No script available
        }
    }

    res.status(400).json({ error: "Invalid action or missing parameters" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Middleware running on port ${PORT}`);
});
