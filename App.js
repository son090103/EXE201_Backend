const express = require('express')
const app = express()
require("dotenv").config()
const bodyParser = require('body-parser')
const ROUTES = require("./router/registry.routes");
var cors = require('cors')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// import để giúp đọc được method post
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())
// cho ba và fe hoạt động được 
const whitelist = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://exe-201-frontend-xjvq.vercel.app",
];

app.use(
    cors({
        origin(origin, callback) {
            // Cho Postman, server-to-server, OPTIONS
            if (!origin) return callback(null, true);

            if (whitelist.includes(origin)) {
                return callback(null, true);
            }

            // ❗ KHÔNG throw error
            return callback(null, false);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("/*", cors());
// cách router để có thể hoạt động được 
ROUTES.forEach(route => {
    if (route.middlewares && route.middlewares.length > 0) {
        app.use(route.prefix, ...route.middlewares, route.router);
    } else {
        app.use(route.prefix, route.router);
    }
});

module.exports = app;