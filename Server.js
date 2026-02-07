const fs = require("fs");
const https = require("https");
const http = require("http");
const app = require("./App");

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
    // Render / production → HTTP
    app.listen(PORT, "0.0.0.0", () => {
        console.log("Production server running");
    });
} else {
    // Local → HTTPS
    const options = {
        key: fs.readFileSync("./localhost+2-key.pem"),
        cert: fs.readFileSync("./localhost+2.pem"),
    };

    https.createServer(options, app).listen(443, () => {
        console.log("Local HTTPS server running");
    });
}
