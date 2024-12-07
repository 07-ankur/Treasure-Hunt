const jwt = require("jsonwebtoken");
const userDB = require("../models/userModal");

const checkLogin = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: "No token. Authorization denied" });
    }

    try {
        // Extract token
        const token = req.headers.authorization.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        console.log("Decoded Token:", decoded); // Verify structure includes `id`
        
        // Find user by ID from decoded token
        const user = await userDB.findById(decoded.id).select('-password'); // Use `id` from token
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(500).json({ message: "Server error during authentication" });
    }
};

module.exports = checkLogin;

