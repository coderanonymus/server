const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let storedJobId = null; // Temporary storage for JobId

// Store JobId from Main Account
app.post("/command", (req, res) => {
    const action = req.body.action;

    if (action === "store_jobid") {
        storedJobId = req.body.jobId;
        console.log("[Server] JobId stored:", storedJobId);
        return res.json({ success: true, message: "JobId stored successfully." });
    }

    if (action === "fetch_jobid") {
        if (storedJobId) {
            console.log("[Server] Sending JobId:", storedJobId);
            const jobIdToSend = storedJobId; // Copy the JobId
            storedJobId = null; // Delete JobId after use
            return res.json({ jobId: jobIdToSend });
        } else {
            return res.status(400).json({ error: "No JobId available." });
        }
    }

    res.status(400).json({ error: "Invalid action." });
});

// Start Server
const PORT = process.env.PORT || 10000; // Ensure it's running on port 10000
app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
});
