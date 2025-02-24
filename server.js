const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let storedJobId = null; // Store JobId temporarily

// Store JobId from Main Account
app.post("/command", (req, res) => {
    const action = req.body.action;

    if (action === "store_jobid") {
        storedJobId = req.body.jobId;
        console.log("JobId stored:", storedJobId);
        return res.json({ success: true, message: "JobId stored successfully." });
    }

    if (action === "get_jobid") {
        if (storedJobId) {
            console.log("Sending JobId:", storedJobId);
            return res.json({ jobId: storedJobId });
        } else {
            return res.json({ error: "No JobId available." });
        }
    }

    res.status(400).json({ error: "Invalid action." });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
