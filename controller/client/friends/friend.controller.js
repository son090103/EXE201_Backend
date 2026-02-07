/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const user = require("./../../../models").User
const friend = require("./../../../models").Friend
module.exports.postFriend = async (req, res) => {
    try {
        const { friend_id } = req.body;
        const userExist = await user.findOne({
            where: {
                id: friend_id
            }
        })
        if (!userExist) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        const user_id = res.locals.users.id;
        // 2️⃣ Check đã gửi request chưa
        const existedRequest = await friend.findOne({
            where: {
                user_id,
                friend_id
            }
        });

        if (existedRequest) {
            return res.status(409).json({
                message: "Friend request already sent"
            });
        }
        const newRequest = await friend.create({
            user_id: user_id,
            friend_id: friend_id,
            status: 'sent'
        })
        await friend.create({
            user_id: friend_id,
            friend_id: user_id,
            status: 'pending'
        })
        return res.status(201).json({
            message: "Friend request sent",
            data: newRequest
        });
    } catch (err) {
        console.log("lỗi trong chương trình là : ", err)
        return res.status(500).json({
            message: "Server error"
        });
    }
}
module.exports.getFriends = async (req, res) => {
    try {
        const user_id = res.locals.users.id;
        const friends = await friend.findAll({
            where: {
                user_id: user_id,
                status: "pending"
            },
            include: {
                model: user,
                as: 'friend', // ⭐ người được gửi request
                attributes: ['id', 'name', 'email', 'avatar']
            }
        })
        res.status(200).json({
            message: "successfully",
            data: friends
        })
    } catch (err) {
        console.log("lỗi trong chương trình trên là : ", err);
        res.status(500).json({
            message: "server error"
        })
    }
}
module.exports.sentFriends = async (req, res) => {
    try {
        const user_id = res.locals.users.id;
        const friends = await friend.findAll({
            where: {
                user_id: user_id,
                status: "sent"
            },
            include: {
                model: user,
                as: 'friend',
                attributes: ['id', 'name', 'email', 'avatar']
            }
        })
        res.status(200).json({
            message: "successfully",
            data: friends
        })
    } catch (err) {
        console.log("lỗi trong chương trình trên là : ", err);
        res.status(500).json({
            message: "server error"
        })
    }
}
module.exports.acceptFriend = async (req, res) => {
    console.log("chạy vào accetFriennd")
    try {
        const { friend_id } = req.body;
        const users_id = res.locals.users.id;
        await friend.update(
            { status: 'accepted' },
            {
                where: {
                    user_id: users_id,
                    friend_id: friend_id,
                    status: 'pending'
                }
            }
        )
        await friend.update(
            { status: 'accepted' },
            {
                where: {
                    user_id: friend_id,
                    friend_id: users_id,
                    status: 'sent'
                }
            }
        )
        res.status(200).json({
            message: "successful"
        })
    } catch (err) {
        console.log("lỗi của chương trình là : ", err)
        res.status(200).json({
            message: "server error"
        })
    }

}
module.exports.friendPrimary = async (req, res) => {
    try {
        const user_id = res.locals.users.id;
        console.log("user_id là : ", user_id)
        const friends = await friend.findAll({
            where: {
                user_id: user_id,
                status: "accepted"
            },
            include: {
                model: user,
                as: 'friend',
                attributes: ['id', 'name', 'email', 'avatar']
            }
        })
        res.status(200).json({
            message: "successfully",
            data: friends
        })
    } catch (err) {
        console.log("lỗi trong chương trình trên là : ", err);
        res.status(500).json({
            message: "server error"
        })
    }
}