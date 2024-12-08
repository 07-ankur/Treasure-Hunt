const jwt = require("jsonwebtoken");
const userDB = require("../models/userModal");

const checkLogin = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: "No token. Authorization denied" });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        console.log("Decoded Token:", decoded);
        
        const user = await userDB.findById(decoded.id).select('-password'); 
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
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

