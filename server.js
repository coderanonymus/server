const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for testing
app.use(express.json()); // Parse incoming JSON requests

// Route to handle Discord commands
app.post('/command', (req, res) => {
    const { action, command } = req.body;

    if (action === 'fetch_command') {
        // Provide the latest command
        const latestCommand = "example_command"; // Replace with actual logic
        return res.status(200).json({ command: latestCommand });
    } else if (action === 'send_command' && command) {
        // Process the received command
        console.log(`Received command from Discord: ${command}`);
        // Forward this to Roblox or store as needed
        return res.status(200).json({ message: "Command received" });
    }

    res.status(400).json({ error: "Invalid action or missing parameters" });
});

// General error handling
app.use((err, req, res, next) => {
    console.error("Middleware Error:", err);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Middleware running on port ${PORT}`);
});
