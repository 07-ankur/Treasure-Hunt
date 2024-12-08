import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import SocketService from "../../utils/socketService";
import { leaveRoom } from "../../services/roomService"; // Import the leaveRoom function

const TreasureHuntGame = () => {
  const { roomId } = useParams();
  const navigate = useNavigate(); // Add navigation
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [gameState, setGameState] = useState({
    grid: Array(9)
      .fill()
      .map(() => Array(9).fill(null)),
    treasureLocation: { x: 0, y: 1 },
    score: 0,
    attempts: 0,
  });

  useEffect(() => {
    // Initialize socket connection and join the room
    SocketService.connect();

    if (user) {
      SocketService.joinRoom(roomId, user.username);
    }

    // Listen for incoming messages (chat messages and notifications)
    SocketService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      SocketService.disconnect();
    };
  }, [roomId, user]);

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(roomId, user.id, token);

      SocketService.leaveRoom(roomId, user.username);

      SocketService.disconnect();

      navigate("/home");
    } catch (error) {
      console.error("Error leaving room:", error);
      alert("Failed to leave room. Please try again.");
    }
  };

  const handleGuess = (x, y) => {
    const isCorrect =
      x === gameState.treasureLocation?.x &&
      y === gameState.treasureLocation?.y;

    const newGrid = [...gameState.grid];
    newGrid[y][x] = isCorrect ? "👑" : "❌";

    setGameState((prev) => ({
      ...prev,
      grid: newGrid,
      score: isCorrect ? prev.score + 1 : prev.score,
      attempts: prev.attempts + 1,
    }));

    // Send guess via socket
    SocketService.sendMessage(
      roomId,
      `${user.username} guessed (${x}, ${y}): ${
        isCorrect ? "Found Treasure!" : "Miss"
      }`,
      user.username
    );
  };

  const sendChatMessage = () => {
    if (newMessage.trim() && user) {
      SocketService.sendMessage(roomId, newMessage, user.username);
      setNewMessage("");
    }
  };

  const renderGrid = () => {
    return gameState.grid.map((row, y) => (
      <div key={y} className="grid-row">
        {row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`grid-cell ${cell || ""}`}
            onClick={() => handleGuess(x, y)}
          >
            {cell || "?"}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="treasure-hunt-container">
      <h1>Treasure Hunt</h1>
      <h2>
        Room ID: <span>{roomId}</span>
      </h2>
      <div className="game-stats">
        <p>Score: {gameState.score}</p>
        <p>Attempts: {gameState.attempts}</p>
      </div>
      <div className="game-grid">{renderGrid()}</div>
      <div className="chat-section">
        <div className="messages">
          {messages.map((msg, index) => (
            <p key={index}>
              {typeof msg === "string"
                ? msg
                : `${msg.username}: ${msg.message}`}
            </p>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message"
            onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
          />
          <button className="send-btn" onClick={sendChatMessage}>
            Send
          </button>
          <button onClick={handleLeaveRoom} className="leave-room-btn">
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreasureHuntGame;
