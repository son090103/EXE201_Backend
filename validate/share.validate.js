const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain uppercase letter")
        .regex(/[a-z]/, "Must contain lowercase letter")
        .regex(/[0-9]/, "Must contain number")
        .regex(/[^A-Za-z0-9]/, "Must contain special character"),
    location_id: z.number(),
    sport_id: z.number()

});
const loginSchema = z.object({
    email: z.string().email("email must format"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain uppercase letter")
        .regex(/[a-z]/, "Must contain lowercase letter")
        .regex(/[0-9]/, "Must contain number")
        .regex(/[^A-Za-z0-9]/, "Must contain special character"),
})
module.exports = {
    registerSchema,
    loginSchema
};