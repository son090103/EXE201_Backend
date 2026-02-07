const clientNotcheck = require("./client/client.notcheck.routes");
const clientcheck = require("./client/client.check..routes")
const checkClient = require("./../middleware/client/authorization")
module.exports = [
  {
    prefix: "/client/notcheck",
    router: clientNotcheck
  },
  {
    prefix: "/client/check",
    middlewares: [checkClient.verifyAccessToken],
    router: clientcheck
  },

];
