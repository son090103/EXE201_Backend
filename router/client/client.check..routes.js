const express = require("express")

const routerCheck = express.Router()
const clientController = require("./../../controller/client/users/users.controller")
const FriendController = require("./../../controller/client/friends/friend.controller")
const MessageController = require("./../../controller/client/message/message.controller")
const multer = require("multer");
const upload = multer();
const uploadIcloud = require("./../../util/uploadicloud")
routerCheck.get("/profile", clientController.profile)
routerCheck.post("/logout", clientController.logout)
routerCheck.get("/users", clientController.getusers)
routerCheck.post("/friend", FriendController.postFriend)
routerCheck.get("/friends", FriendController.getFriends)
routerCheck.get("/sentFriends", FriendController.sentFriends)
routerCheck.post("/acceptFriend", FriendController.acceptFriend)
routerCheck.get("/friendPrimary", FriendController.friendPrimary)
routerCheck.post("/postMessage", MessageController.postMessage) // post message
routerCheck.post("/postRoomChat", MessageController.postRoomchat)
routerCheck.get("/getRoomchat", MessageController.getRoomchat)
routerCheck.get("/viewMessage/:chat_room_id", MessageController.viewMessage)
routerCheck.post("/postGroupchat", MessageController.postGroupchat)
routerCheck.put("/roomChat", MessageController.changeStatusRoomChat)
// view group chat của cộng đồng mà mình chưa tham gia
routerCheck.get("/groupchat", MessageController.viewGroupchatCommnity)
routerCheck.post("/joinGroupChat", MessageController.joinGroupChat)
routerCheck.post("/postcommunity",
    upload.array("images", 3),
    uploadIcloud.uploadIclod,
    MessageController.postCommunity)
// xây dụng 1 trang profile
routerCheck.get("/getPostCommunity", MessageController.getPostCommunity)
routerCheck.put("/updateProfile", upload.single("avatar"),
    uploadIcloud.uploadIclod,
    clientController.updateProfile)
routerCheck.post("/postEvents",
    upload.array("images", 2),
    uploadIcloud.uploadIclod,
    clientController.postEvent)
routerCheck.get("/viewEvent", clientController.viewEvent)
module.exports = routerCheck;