const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
    const { _id, username, email } = user; // Include _id in the payload

    return jwt.sign(
        { id: _id, username, email }, // Include `id` instead of `password`
        process.env.JWTSECRET,
        {
            expiresIn: "30d", // Adjust expiry if needed
        }
    );
};

module.exports = generateToken;
