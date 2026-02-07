const jwt = require("jsonwebtoken");
/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const user = require("./../../models").User
/** @type {import("sequelize").ModelStatic<import("sequelize").Model>} */
const Community_member = require("./../../models").Community_Member

const Communitys = require("./../../models").Community
const Locations = require("./../../models").Location
const Sport = require("./../../models").Sport
module.exports.verifyAccessToken = async (req, res, next) => {
    try {
        // 🔑 LẤY TOKEN TỪ COOKIE
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No access token"
            });
        }
        console.log("1")
        // 🔐 VERIFY TOKEN
        const decoded = jwt.verify(
            token,
            process.env.ACCESSTOKEN_KEY
        );
        console.log("2")
        const users = await user.findOne({
            where: {
                id: decoded.users_id
            },
            include: [
                {
                    model: Community_member,
                    include: [
                        {
                            model: Communitys, // 👈 biết user thuộc community nào
                            include: [
                                {
                                    model: Locations,
                                    as: 'Location',
                                },
                                {
                                    model: Sport,
                                    as: 'Sport'
                                }
                            ],
                        }
                    ]
                }
            ]
        })
        console.log("user middleware là : ", users)
        // ✅ gắn user info vào request
        res.locals.users = users
        res.locals.location = users.Community_Members[0].Community.Location
        /* "Location bao gồm những thuộc tính dưới đây": {
        "id": 2,
            "name": "Đà Nẵng",
                "createdAt": "2026-01-15T15:03:18.042Z",
                    "updatedAt": "2026-01-15T15:03:18.042Z"
                    */

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Access token expired or invalid"
        });
    }
};
