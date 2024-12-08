const router = require("express").Router();
const { createRoom, joinRoom, leaveRoom } = require("../controllers/roomController");
const checkLogin = require("../middlewares/authHandler"); 

// Protected routes with checkLogin middleware
router.post('/create-room', checkLogin, createRoom);
router.post('/join-room', checkLogin, joinRoom);
router.post('/leave-room', checkLogin, leaveRoom);

module.exports = router;