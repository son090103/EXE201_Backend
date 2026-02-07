const express = require("express")

const routerNotcheck = express.Router()
const clientController = require("./../../controller/client/users/users.controller")
routerNotcheck.get("/locations", clientController.getLocations)
routerNotcheck.get("/sport", clientController.getSport)
routerNotcheck.post("/register", clientController.register)
routerNotcheck.post("/login", clientController.login)
routerNotcheck.get("/getProfileUser/:id", clientController.getProfileUser)
module.exports = routerNotcheck;