const router = require("express").Router();
const { createRoom, joinRoom } = require("../controllers/roomController");
const checkLogin = require("../middlewares/authHandler"); // Assuming the middleware is in this path

// Protected routes with checkLogin middleware
router.post('/create-room', checkLogin, createRoom);
router.post('/join-room', checkLogin, joinRoom);

module.exports = router;