// có thể làm theo cách này 1 lần 
// /** @type {import("sequelize").ModelStatic<any>} */
// const { User, Chat_rooms, Chat_messages } = require("./../../../models");

/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const user = require("./../../../models").User
/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const friend = require("./../../../models").Friend
/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const Chat_rooms_users = require("./../../../models").Chat_rooms_users
/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const Chat_rooms = require("./../../../models").Chat_rooms
/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const Chat_messages = require("./../../../models").Chat_messages

const CommunityPostImage = require("./../../../models").CommunityPostImage
const CommunityPost = require("./../../../models").CommunityPost
const { Op, literal } = require("sequelize");
const { sequelize, Sequelize } = require("./../../../models");
// phần này đang có vấn đề
module.exports.postMessage = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = res.locals.users.id; // user đang đăng nhập
        const { roomId, content } = req.body;

        // 1️⃣ Validate input
        if (!roomId || !content?.trim()) {
            return res.status(400).json({
                message: "Thiếu roomId hoặc content",
            });
        }

        // 2️⃣ Check room tồn tại & active
        const room = await Chat_rooms.findOne({
            where: {
                id: roomId,
                is_deleted: false,
                status: "active",
            },
            transaction: t,
        });

        if (!room) {
            return res.status(404).json({
                message: "Chat room không tồn tại hoặc đã bị khóa",
            });
        }

        // 3️⃣ Check user có thuộc room không
        const isMember = await Chat_rooms_users.findOne({
            where: {
                chat_room_id: roomId,
                user_id: userId,
            },
            transaction: t,
        });

        if (!isMember) {
            return res.status(403).json({
                message: "Bạn không thuộc chat room này",
            });
        }

        // 4️⃣ Tạo message
        const message = await Chat_messages.create(
            {
                chat_room_id: roomId,
                user_id: userId,
                content,
            },
            { transaction: t }
        );

        await t.commit();

        return res.status(201).json({
            message: "Gửi tin nhắn thành công",
            data: message,
        });

    } catch (err) {
        await t.rollback();
        console.error("❌ postMessage error:", err);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
module.exports.postRoomchat = async (req, res) => {
    console.log("chạy vào post room chat")
    const t = await sequelize.transaction();
    try {
        const { friend_id } = req.body;
        if (!friend_id) {
            return res.status(400).json({ message: "Thiếu friendId" });
        }
        const users_id = res.locals.users.id;
        const roomUser = await Chat_rooms_users.findOne({
            attributes: ["chat_room_id"], // chỉ select cột này 
            where: {
                user_id: {
                    [Op.in]: [users_id, friend_id],
                },
            },
            group: ["chat_room_id"],
            having: Sequelize.literal("COUNT(DISTINCT user_id) = 2"),
            transaction: t,
        });

        /** 2️⃣ NẾU ĐÃ TỒN TẠI */
        if (roomUser) {
            await t.commit();
            console.log("id room là : ", roomUser.chat_room_id)
            return res.status(200).json({
                roomId: roomUser.chat_room_id,
                existed: true,
            });
        }

        /** 3️⃣ CHƯA CÓ → TẠO ROOM */
        const newRoom = await Chat_rooms.create(
            {
                type_room: "private",
                status: "active",
                owner_id: users_id,
            },
            { transaction: t }
        );

        await Chat_rooms_users.bulkCreate(
            [
                { chat_room_id: newRoom.id, user_id: users_id },
                { chat_room_id: newRoom.id, user_id: friend_id },
            ],
            { transaction: t }
        );

        await t.commit();
        console.log("id room là : ", newRoom.id)
        return res.status(201).json({
            roomId: newRoom.id,
            existed: false,
        });
    } catch (err) {
        console.log("lỗi của chương trình là : ", err)
        res.status(500).json({
            message: "server error"
        })
    }
}
module.exports.getRoomchat = async (req, res) => {
    try {
        const userId = res.locals.users.id;
        const rooms = await Chat_rooms_users.findAll({
            where: {
                user_id: userId,
            },
            include: [
                {
                    model: Chat_rooms,
                    where: {
                        status: "active"
                    },
                    include: [
                        {
                            model: Chat_rooms_users,
                            as: 'members',
                            where: {
                                user_id: {
                                    [Op.ne]: userId, // 🔥 loại trừ chính mình
                                },
                            },
                            include: [
                                {
                                    model: user,
                                    attributes: ['id', 'name', 'email', 'avatar'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        console.log("room là : ", rooms)
        // format lại data cho frontend dễ dùng
        const friends = rooms.map(r => {
            console.log("r là : ", r)
            const member = r.user_id
            return {
                roomId: r.chat_room_id,
                friend: member,
            };
        });

        return res.status(200).json(rooms);

    } catch (err) {
        console.error("❌ lỗi lấy room chat:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports.viewMessage = async (req, res) => {
    try {
        const userId = res.locals.users?.id; // user đang login
        if (!userId) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        // Lấy chat_room_id từ params
        const { chat_room_id } = req.params;
        if (!chat_room_id) {
            return res.status(400).json({ message: "Thiếu chat_room_id" });
        }

        // Kiểm tra user có thuộc chat room không
        const isMember = await Chat_rooms_users.findOne({
            where: {
                chat_room_id: chat_room_id,
                user_id: userId,
            },
            include: [
                {
                    model: user,
                    attributes: ["id", "name", "email", "avatar"], // tuỳ bạn
                },
            ],
        });

        if (!isMember) {
            return res.status(403).json({ message: "Bạn không thuộc chat room này" });
        }

        // Lấy tất cả tin nhắn của chat room, kèm info user
        const messages = await Chat_messages.findAll({
            where: { chat_room_id: chat_room_id },
            include: [
                {
                    model: user,
                    attributes: ["id", "name", "avatar"],
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        return res.status(200).json(messages);
    } catch (err) {
        console.log("lỗi trong chương trình là : ", err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports.postGroupchat = async (req, res) => {
    try {
        // community là :  để biết là group của cộng đồng nào
        const location = res.locals.location
        console.log("location Id trong post group là :", location)
        const userId = res.locals.users?.id
        console.log("userId là postgroupchat  : ", userId)
        const { name, member_ids, visibility = 'private' } = req.body;
        console.log("name là là : ", name)

        // ========================
        // 1. Validate
        // ========================
        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Group name is required",
            });
        }

        if (!Array.isArray(member_ids) || member_ids.length < 1) {
            return res.status(400).json({
                message: "Group must have at least 1 member besides owner",
            });
        }

        // loại trùng + thêm owner
        const members = Array.from(
            new Set([...member_ids, userId])
        );

        // ========================
        // 2. Tạo group chat
        // ========================
        const groupChat = await Chat_rooms.create({
            name: name.trim(),               // ⚠️ cần có cột name
            type_room: 'group',
            visibility,
            owner_id: userId,
            allow_join_request: false,
            community_id: location.id
        });

        // ========================
        // 3. Thêm members
        // ========================
        const roomUsers = members.map((uid) => ({
            chat_room_id: groupChat.id,
            user_id: uid,
            role: uid === userId ? 'owner' : 'member',
        }));

        await Chat_rooms_users.bulkCreate(roomUsers);

        // ========================
        // 4. Response
        // ========================
        return res.status(201).json({
            message: "Group chat created successfully",
            data: {
                id: groupChat.id,
                name: groupChat.name,
                owner_id: userId,
                members,
            },
        });

    } catch (err) {
        console.error("❌ lỗi chương trình là:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
module.exports.changeStatusRoomChat = async (req, res) => {
    try {
        console.log("upodate trang thái ")
        const userId = res.locals.users.id; // user đang đăng nhập
        const { room_id } = req.body;

        if (!room_id) {
            return res.status(400).json({
                message: "Thiếu room_id",
            });
        }

        // 1️⃣ Check room tồn tại
        const room = await Chat_rooms.findByPk(room_id);

        if (!room) {
            return res.status(404).json({
                message: "Chat room không tồn tại",
            });
        }

        // ❌ Không cho đổi room private 1-1
        if (room.type_room === "private") {
            return res.status(400).json({
                message: "Không thể đổi trạng thái chat riêng tư 1-1",
            });
        }

        // 2️⃣ Check quyền owner / admin
        const isAdmin = await Chat_rooms_users.findOne({
            where: {
                chat_room_id: room_id,
                user_id: userId,
                role: {
                    [Op.in]: ["owner", "admin"],
                },
            },
        });

        if (!isAdmin) {
            return res.status(403).json({
                message: "Bạn không có quyền thay đổi trạng thái phòng",
            });
        }

        // 3️⃣ Toggle trạng thái
        const newVisibility =
            room.visibility === "private" ? "public" : "private";

        await room.update({
            visibility: newVisibility,
        });
        console.log("update thành công")
        return res.status(200).json({
            message: "Cập nhật trạng thái phòng thành công",
            data: {
                room_id: room.id,
                visibility: room.visibility,
            },
        });
    } catch (err) {
        console.error("❌ Lỗi changeStatusRoomChat:", err);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
module.exports.viewGroupchatCommnity = async (req, res) => {
    try {
        const users = res.locals.users;
        console.log("user trong froup chat là : ", users)
        const user_community_id = users.Community_Members[0].Community.Location.id
        const group_chat = await Chat_rooms.findAll({
            where: {
                community_id: user_community_id,
                type_room: 'group',
                visibility: "public",
                owner_id: {
                    [Op.ne]: users.id
                },
                [Op.and]: [
                    literal(`
  NOT EXISTS (
    SELECT 1
    FROM "Chat_rooms_users" cru
    WHERE cru.chat_room_id = "Chat_rooms".id
      AND cru.user_id = ${users.id}
  )
`)

                ]
            }
        });
        return res.status(200).json({
            message: "success fully",
            data: group_chat
        })
    } catch (err) {
        console.log("lỗi trong chương trinh trên là : ", err)
    }
}
module.exports.joinGroupChat = async (req, res) => {
    try {
        const user = res.locals.users;
        const { chat_room_id } = req.body;

        if (!chat_room_id) {
            return res.status(400).json({
                message: "chat_room_id is required"
            });
        }

        // 1️⃣ Check group tồn tại
        const group = await Chat_rooms.findByPk(chat_room_id);

        if (!group) {
            return res.status(404).json({
                message: "Group chat not found"
            });
        }

        // 2️⃣ Nếu là owner thì không cần join
        if (group.owner_id === user.id) {
            return res.status(400).json({
                message: "You are the owner of this group"
            });
        }

        // 3️⃣ Check đã là member chưa
        const existed = await Chat_rooms_users.findOne({
            where: {
                chat_room_id,
                user_id: user.id
            }
        });

        if (existed) {
            return res.status(400).json({
                message: "You already joined this group"
            });
        }

        // 4️⃣ Join group
        const newMember = await Chat_rooms_users.create({
            chat_room_id,
            user_id: user.id
        });

        return res.status(200).json({
            message: "Join group chat successfully",
            data: newMember
        });

    } catch (err) {
        console.log("Join group chat error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
const uploadToCloud = require("../../../helper/uploadtocloud");
module.exports.postCommunity = async (req, res) => {
    const t = await sequelize.transaction();
    console.log("chạy vào post bài")
    try {
        console.log("1111")
        const userId = res.locals.users?.id;
        if (!userId) {
            await t.rollback();
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        const { community_id, content, post_type } = req.body;
        console.log("4444")
        // 1️⃣ Validate input
        if (!community_id || !content) {
            await t.rollback();
            return res.status(400).json({
                message: "community_id và content là bắt buộc",
            });
        }
        console.log("1111")
        // 2️⃣ Upload ảnh (nếu có)
        let images = [];
        if (Array.isArray(req.files) && req.files.length > 0) {
            images = await Promise.all(
                req.files.map(file => uploadToCloud(file.buffer))
            );
        }
        console.log("22222")
        // 3️⃣ Tạo post
        const post = await CommunityPost.create(
            {
                community_id,
                user_id: userId,
                content,
                post_type: post_type || "share",
            },
            { transaction: t }
        );
        console.log("3333")
        // 4️⃣ Lưu ảnh (nếu có)
        if (images.length > 0) {
            const imageData = images.map(url => ({
                post_id: post.id,
                image_url: url,
            }));

            await CommunityPostImage.bulkCreate(imageData, {
                transaction: t,
            });
        }
        console.log("44444")
        // 5️⃣ Commit
        await t.commit();

        return res.status(201).json({
            message: "Tạo bài viết thành công",
            data: post,
        });

    } catch (err) {
        await t.rollback();
        console.error("❌ postCommunity error:", err);

        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};


module.exports.getPostCommunity = async (req, res) => {
    try {
        const users = res.locals.users;
        const community_id = users.Community_Members[0].Community.Location.id

        if (!community_id) {
            return res.status(400).json({
                message: "Thiếu community_id"
            });
        }

        const posts = await CommunityPost.findAll({
            where: {
                community_id,
            },
            include: [
                {
                    model: user,
                    as: "author",
                    attributes: ["id", "name", "avatar"]
                },
                {
                    model: CommunityPostImage,
                    as: "images"
                }
            ],
        });

        return res.status(200).json({
            message: "Lấy bài viết community thành công",
            data: posts
        });

    } catch (err) {
        console.log("lỗi của chương trình là :", err);
        return res.status(500).json({
            message: "Lỗi server"
        });
    }
};
