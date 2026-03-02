
const bcrypt = require("bcrypt")
/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const user = require("./../../../models").User
const localtion = require("./../../../models").Location
const Location_User = require("./../../../models").Location_User
const friend = require("./../../../models").Friend
const sport = require("./../../../models").Sport
const community = require("./../../../models").Community
const Community_Member = require("./../../../models").Community_Member
const { sequelize } = require("./../../../models")
const { registerSchema, loginSchema } = require("./../../../validate/share.validate");
const jwt = require("jsonwebtoken");
const { Op, where } = require("sequelize")
const uploadToCloud = require("../../../helper/uploadtocloud")
const Event = require("./../../../models").Event
const EventImage = require("./../../../models").EventImage

const CommunityPostImage = require("./../../../models").CommunityPostImage
const CommunityPost = require("./../../../models").CommunityPost
module.exports.register = async (req, res) => {
    const t = await sequelize.transaction(); // nên sử dụng transaction
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validate error",
                errors: parsed.error.flatten().fieldErrors
            });
        }

        var { name, email, password, location_id, sport_id } = parsed.data
        const findUser = await user.findOne({
            where: {
                email: email
            }
        })
        if (findUser) {
            await t.rollback();
            return res.status(409).json({
                message: "User exsit"
            })
        }
        const sports = await sport.findOne({
            where: {
                id: sport_id
            }
        })
        if (!sports) {
            await t.rollback();
            return res.status(400).json({
                message: "Invalid location",
            });
        }
        const locations = await localtion.findOne({
            where: {
                id: location_id
            }
        });
        if (!locations) {
            await t.rollback();
            return res.status(400).json({
                message: "Invalid location",
            });
        }
        console.log("id của chương trình là : ", sport_id, location_id)
        const communitys = await community.findOne({
            where: {
                sport_id: sport_id,
                location_id: location_id
            }
        })
        if (!communitys) {
            await t.rollback();
            return res.status(400).json({
                message: "Invalid location",
            });
        }
        if (!name || !email || !password) {
            await t.rollback();
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const avatar = "https://res.cloudinary.com/dmdogr8na/image/upload/v1746949468/hnrnjeaoymnbudrzs7v9.jpg"
        const role_id = 2;

        password = await bcrypt.hash(password, 10);
        const users = await user.create({
            name: name,
            email: email,
            password: password,
            avatar: avatar,
            role_id: role_id,
            location_id: location_id
        }, { transaction: t })
        await Location_User.create({
            user_id: users.id,
            location_id: location_id
        }, { transaction: t });
        await Community_Member.create({
            user_id: users.id,
            community_id: communitys.id
        }, { transaction: t });
        await t.commit()
        return res.status(200).json({
            message: "register successfull"
        })
    } catch (err) {
        await t.rollback();
        console.log("lỗi trong chương trình là : ", err)
        return res.status(500).json({
            message: "server error"
        })
    }
}
module.exports.login = async (req, res) => {
    console.log("bắt đầu chạy vào login")
    try {

        const parsed = loginSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validate error",
                errors: parsed.error.flatten().fieldErrors
            });
        }
        const { email, password } = parsed.data
        const users = await user.findOne({
            where: {
                email: email
            }
        })
        if (!users) {
            return res.status(404).json({
                message: "users not found"
            })
        }
        const compare = await bcrypt.compare(password, users.password)
        if (!compare) {
            return res.status(404).json({
                message: "password not match"
            })
        }
        const accesstoken = jwt.sign(
            {
                users_id: users.id
            },
            process.env.ACCESSTOKEN_KEY,
            {
                expiresIn: process.env.ACCESSTOKEN_ExpiresIn
            }

        )
        const refesh_token = jwt.sign(
            {
                users_id: users.id
            },
            process.env.Refresh_Token,
            {
                expiresIn: process.env.REFESHTOKEN_ExpiresIn
            }

        )
        res
            .cookie("access_token", accesstoken, {
                httpOnly: true,
                secure: true,       // bắt buộc HTTPS
                sameSite: "none",
                maxAge: 60 * 60 * 1000
            })
            //Khi hết thời gian → trình duyệt xóa cookie
            .cookie("refresh_token", refesh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            })
            // trình duyệt sẽ tự xóa đi
            .json({ message: "Login successful" });
    } catch (err) {
        console.log("lỗi trong chương trình là : ", err)
    }
}
module.exports.getLocations = async (req, res) => {
    try {
        const locations = await localtion.findAll({
            where: {
                isActive: true
            }
        })
        res.status(200).json({
            message: "successfull",
            data: locations
        })
    } catch (err) {
        console.log("lỗi trong chương trình là : ", err)
        res.status(500).json({
            message: "server error",
        })
    }
}
module.exports.getSport = async (req, res) => {
    try {
        const sports = await sport.findAll();
        res.status(200).json({
            message: "successfully",
            data: sports
        })
    } catch (err) {
        console.log("lỗi trong chuowg trình là : ", err)
        res.status(500).json({
            message: "server error",
        })
    }
}
module.exports.profile = async (req, res) => {
    try {
        const users = res.locals.users;
        console.log("user trong profile là : ", users)
        if (!users) {
            return res.json({ user: null });
        }
        return res.status(200).json({
            message: "successfully",
            data: users
        })
    } catch (err) {
        console.log("lỗi trong chương trình là: ", err)
        return res.status(500).json({
            message: "server error",
        })
    }
}
module.exports.logout = async (req, res) => {
    console.log("chạy vào lougout")
    try {
        res
            .clearCookie("access_token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            .clearCookie("refresh_token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            .status(200)
            .json({
                message: "Logout successful",
            });
    } catch (error) {
        console.log("Logout error:", error);
        res.status(500).json({
            message: "Server error",
        });
    }
}

module.exports.getusers = async (req, res) => {
    try {
        const users = res.locals.users;
        const role_id = users.role_id;
        const localtio_id = await Location_User.findOne({
            where: {
                user_id: users.id
            }
        })
        if (!localtio_id) {
            return res.status(404).json({
                message: "location not found"
            })
        }
        const usersFriend = await user.findAll({
            where: {
                role_id: role_id,
                id: {
                    [Op.ne]: users.id // loại trừ chính mình
                }
            },
            include: [
                {
                    model: localtion,
                    where: { id: localtio_id.location_id }, // Location_ID bạn muốn lọc
                    attributes: [] // không cần dữ liệu Location
                }
            ],
            attributes: ['id', 'name', 'email', 'avatar'], // chỉ lấy những dữ liệu này mà thôi
            limit: 5
        });
        res.status(200).json({
            message: "successfully",
            data: usersFriend
        })
    } catch (err) {
        console.log("lỗi chương trình là : ", err)
        return res.status(500).json({
            message: "server error"
        })
    }
}
module.exports.updateProfile = async (req, res) => {
    try {
        const users = res.locals.users;

        if (!users) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, location_id, sport_id } = req.body;
        const avatar = req.body.avatar; // do uploadIclod gán
        console.log("sport_id là là ", sport_id)
        /* =========================
           1. BUILD UPDATE DATA (SAFE)
        ========================== */
        const updateData = {};

        // ✅ chỉ update name nếu có
        if (typeof name === "string" && name.trim() !== "") {
            updateData.name = name.trim();
        }

        // ✅ chỉ update avatar nếu có upload
        if (typeof avatar === "string" && avatar.trim() !== "") {
            updateData.avatar = avatar;
        }

        // 👉 chỉ update nếu thật sự có data
        if (Object.keys(updateData).length > 0) {
            await users.update(updateData);
        }

        /* =========================
           2. UPDATE LOCATION
        ========================== */
        let finalLocationId = location_id;

        const existingLocation = await Location_User.findOne({
            where: { user_id: users.id }
        });

        if (finalLocationId) {
            if (existingLocation) {
                await existingLocation.update({ location_id: finalLocationId });
            } else {
                await Location_User.create({
                    user_id: users.id,
                    location_id: finalLocationId
                });
            }
        } else {
            finalLocationId =
                users.Community_Members?.[0]?.Community?.location_id;
        }

        /* =========================
           3. UPDATE SPORT (COMMUNITY)
        ========================== */
        if (sport_id && finalLocationId) {
            const foundCommunity = await community.findOne({
                where: {
                    sport_id,
                    location_id: finalLocationId
                }
            });
            console.log("found là : ", foundCommunity)
            if (!foundCommunity) {
                return res.status(404).json({
                    message: "Community not found"
                });
            }

            const member = await Community_Member.findOne({
                where: { user_id: users.id }
            });

            if (member) {
                await Community_Member.update(
                    { community_id: foundCommunity.id },
                    { where: { user_id: users.id } }
                );

            } else {
                await Community_Member.create({
                    user_id: users.id,
                    community_id: foundCommunity.id
                });
            }
        }

        /* =========================
           4. RETURN UPDATED USER
        ========================== */
        const updatedUser = await user.findByPk(users.id, {
            attributes: ['id', 'name', 'email', 'avatar'],
            include: [
                {
                    model: Community_Member,
                    include: [{ model: community }]
                }
            ]
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (err) {
        console.error("lỗi update profile:", err);
        return res.status(500).json({ message: "server error" });
    }
};
module.exports.postEvent = async (req, res) => {
    console.log("chạy vào post envent")
    const t = await sequelize.transaction();
    try {
        const users = res.locals.users;
        const location_id = users.Community_Members[0].Community.Location.id
        const {
            category,
            title,
            description,
            registration_start_date,
            registration_end_date,
            start_date,
            end_date,
            location,
            city,
            max_participants,
            privacy,
        } = req.body;

        // 1️⃣ Validate required fields
        if (!category || !title || !start_date || !end_date) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        console.log("location id và sport id là : ", category, location_id)
        const commuity = await community.findOne({
            where: {
                sport_id: category,
                location_id: location_id
            }
        })
        console.log("community là : ", commuity)
        // 2️⃣ Create Event
        const event = await Event.create(
            {
                community_id: commuity.id,
                created_by: users.id, // from auth middleware
                title,
                description,
                registration_start_date,
                registration_end_date,
                start_date,
                end_date,
                location,
                city,
                max_participants,
                privacy
            },
            { transaction: t }
        );

        // 3️⃣ Create images (if any)
        let images = [];
        if (Array.isArray(req.files) && req.files.length > 0) {
            images = await Promise.all(
                req.files.map(file => uploadToCloud(file.buffer))
            );
        }
        if (Array.isArray(images) && images.length > 0) {
            const imageData = images.map((url, index) => ({
                event_id: event.id,      // ✅ correct FK
                image_url: url,
                is_cover: index === 0,   // optional: first image as cover
                sort_order: index
            }));

            await EventImage.bulkCreate(imageData, {
                transaction: t
            });
        }

        // 4️⃣ Commit transaction
        await t.commit();

        return res.status(201).json({
            message: 'Event created successfully',
            data: event
        });

    } catch (err) {
        await t.rollback();
        console.error('❌ postEvent error:', err);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};
module.exports.viewEvent = async (req, res) => {
    try {
        const events = await Event.findAll({
            // where: {
            //     status: ['upcoming', 'ongoing'] // chỉ show event còn hiệu lực
            // },
            order: [['start_date', 'ASC']],
            include: [
                {
                    model: EventImage,
                    as: 'images',
                    attributes: [
                        'id',
                        'image_url',
                        'is_cover',
                        'sort_order'
                    ],
                    where: { is_cover: true },
                    required: false // ⚠️ event không có ảnh vẫn hiện
                },
                {
                    model: community,
                    as: 'community',
                    attributes: ['id'],
                    include: [
                        {
                            model: sport,
                            as: "Sport",
                            attributes: ['id', 'name']
                        },
                        // {
                        //     model: Location,
                        //     attributes: ['id', 'name']
                        // }
                    ]
                },
                {
                    model: user,
                    as: 'creator',
                    attributes: ['id', 'name', 'avatar']
                }
            ]
        });

        return res.status(200).json({
            message: 'Get all events successfully',
            total: events.length,
            data: events
        });

    } catch (err) {
        console.error('❌ viewAllEvents error:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};
module.exports.getProfileUser = async (req, res) => {
    console.log("chạy vào getUser")
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Thiếu userId"
            });
        }
        const User = await user.findOne({
            where: { id },
            attributes: {
                exclude: ["password", "refreshToken"]
            },
            include: [
                {
                    model: Community_Member,
                    include: [
                        {
                            model: community, // 👈 biết user thuộc community nào
                            include: [
                                {
                                    model: localtion,
                                    as: 'Location',
                                },
                                {
                                    model: sport,
                                    as: 'Sport'
                                }
                            ],
                        }
                    ]
                }
            ]
        });
        if (!User) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            });
        }
        return res.status(200).json({
            message: "Lấy profile thành công",
            data: User
        });
    } catch (err) {
        console.log("lỗi của chương trình là : ", err);
        return res.status(500).json({
            message: "Lỗi server"
        });
    }
};

module.exports.homeUser = async (req, res) => {
    try {
        const users = res.locals.users;
        const user_id = users.id;

        if (!user_id) {
            return res.status(400).json({
                message: "Không tìm thấy user"
            });
        }

        const posts = await CommunityPost.findAll({
            where: {
                user_id,
            },
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: user,
                    as: "author",
                    attributes: ["id", "name", "avatar"]
                },
                {
                    model: CommunityPostImage,
                    as: "images"
                },
                {
                    model: community,
                    as: "community",
                    attributes: ["id", "name"]
                }
            ],
        });

        return res.status(200).json({
            message: "Lấy danh sách bài viết của user thành công",
            data: posts
        });

    } catch (err) {
        console.log("lỗi của chương trình là :", err);
        return res.status(500).json({
            message: "Lỗi server"
        });
    }
};