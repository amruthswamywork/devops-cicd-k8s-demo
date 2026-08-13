const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>DevOps CI/CD Demo</title>
            </head>

            <body>
                <h1>DevOps CI/CD Kubernetes Project</h1>

                <h2>GitHub → Jenkins → Docker → Docker Hub → Kubernetes</h2>

                <p>Application Version: 3.0</p>

                <p>Status: Running</p>
            </body>
        </html>
    `);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        version: "1.0"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application running on port ${PORT}`);
});
