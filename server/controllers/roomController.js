const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const roomDB = require("../models/roomModal");
const mongoose = require("mongoose");
const userDB = require("../models/userModal");

const createRoom = asyncHandler(async (req, res) => {
  const { roomId, password, userId } = req.body;

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

  const existingRoom = await roomDB.findOne({ roomId });
  if (existingRoom) {
    res.status(400);
    throw new Error(
      "Room with this ID already exists. Please use a different Room ID."
    );
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newRoom = new roomDB({
      roomId,
      password: hashedPassword,
      players: [userObjectId], 
    });

    const savedRoom = await newRoom.save();

    res.status(201).json({
      message: "Room created successfully",
      roomId: savedRoom.roomId,
    });
  } catch (error) {
    console.error(error); 
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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    findRoom.players.push(userObjectId);
    await findRoom.save();

    res.status(200).json({
      message: "Room joined successfully",
      roomId: findRoom.roomId,
    });
  } catch (error) {
    console.error(error); 
    res.status(500);
    throw new Error(
      "An error occurred while joining the room. Please try again later."
    );
  }
});

const leaveRoom = asyncHandler(async (req, res) => {
  const { roomId, userId } = req.body;

  if (!roomId || !userId) {
    res.status(400);
    throw new Error("Please provide roomId and userId");
  }

  try {
    const room = await roomDB.findOne({ roomId });
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    room.players = room.players.filter(
      playerId => !playerId.equals(userObjectId)
    );

    await room.save();

    if (room.players.length === 0) {
      await roomDB.deleteOne({ roomId });
      return res.status(200).json({
        message: "Room left successfully and room deleted as no players remained",
        roomId
      });
    }

    res.status(200).json({
      message: "Successfully left the room",
      roomId,
      remainingPlayers: room.players.length
    });
  } catch (error) {
    console.error(error); 
    res.status(500);
    throw new Error(
      "An error occurred while leaving the room. Please try again later."
    );
  }
});

module.exports = { createRoom, joinRoom, leaveRoom };
