const https = require("https");
const fs = require("fs");
const app = require("./App");

const port = process.env.PORT || 443;

const options = {
    key: fs.readFileSync("./localhost+2-key.pem"),
    cert: fs.readFileSync("./localhost+2.pem"),
};

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
});
