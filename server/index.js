const express = require("express");
const app = express();
const port = process.env.PORT || 3002;
require("dotenv").config();
const connect = require("./db/db");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

// Routes import
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const errorHandler = require("./middlewares/errorHandler");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);

// Server test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working perfectly" });
});

// Error handler
app.use(errorHandler);

// Connection to MongoDB
connect(process.env.MONGO_URI);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO Connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    // Fixed template string and message format
    io.to(roomId).emit('message', `${username} has joined the room.`);
  });

  socket.on('sendMessage', ({ roomId, message, username }) => {
    // Include username in the message emission
    io.to(roomId).emit('message', { username, message });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});