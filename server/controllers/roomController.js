const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const roomDB = require("../models/roomModal");
const mongoose = require("mongoose");
const userDB = require("../models/userModal");

const createRoom = asyncHandler(async (req, res) => {
  const { roomId, password, userId } = req.body;

  // Validate input fields
  if (!roomId || !password || !userId) {
    res.status(400);
    throw new Error(
      "Please provide all required fields: roomId, password, and userId."
    );
  }

  const user=await userDB.findById({_id:userId})
  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  // Check if room with the given roomId already exists
  const existingRoom = await roomDB.findOne({ roomId });
  if (existingRoom) {
    res.status(400);
    throw new Error(
      "Room with this ID already exists. Please use a different Room ID."
    );
  }

  try {
    // Ensure userId is a valid ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Hash the room password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new room object
    const newRoom = new roomDB({
      roomId,
      password: hashedPassword,
      players: [userObjectId], // Use ObjectId for players
    });

    // Save the room to the database
    const savedRoom = await newRoom.save();

    // Respond with success
    res.status(201).json({
      message: "Room created successfully",
      roomId: savedRoom.roomId,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error(error); // Log the actual error for debugging
    res.status(500);
    throw new Error(
      "An error occurred while creating the room. Please try again later."
    );
  }
});

const joinRoom = asyncHandler(async (req, res) => {
  const { roomId, password, userId } = req.body;

  if (!roomId || !password || !userId) {
    res.status(400);
    throw new Error("Please enter all the details properly");
  }

  try {
    const findRoom = await roomDB.findOne({ roomId });
    if (!findRoom) {
      res.status(404);
      throw new Error("Room not found. Please create room");
    }

    const comparePassword = await bcrypt.compare(password, findRoom.password);
    if (!comparePassword) {
      res.status(404);
      throw new Error("Password incorrect");
    }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Add user to players
    findRoom.players.push(userObjectId);
    await findRoom.save();

    res.status(200).json({
      message: "Room joined successfully",
      roomId: findRoom.roomId,
    });
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500);
    throw new Error(
      "An error occurred while joining the room. Please try again later."
    );
  }
});

module.exports = { createRoom, joinRoom };
