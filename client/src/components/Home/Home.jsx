import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../../services/roomService";
import { AuthContext } from "../../context/authContext";

const Home = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  console.log(user.id);
  const userID = user.id;

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError("");

    if (!roomId || !password) {
      setError("Room ID and password are required!");
      return;
    }

    try {
      const response = await createRoom(roomId, password, userID, token);

      if (response.message === "Room created successfully") {
        navigate(`/room/${response.roomId}`);
      } else {
        setError(response.message || "Failed to create room");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating room. Please try again.");
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError("");

    if (!roomId || !password) {
      setError("Room ID and password are required!");
      return;
    }

    try {
      const response = await joinRoom(roomId, password, userID, token);

      if (response.message === "Room joined successfully") {
        navigate(`/room/${response.roomId}`);
      } else {
        setError(response.message || "Failed to join room");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error joining room. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Treasure Hunt Game</h1>
        <div className="user-info">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
      <div className="home-welcome">
        <span>Welcome, {user?.username || "Player"}!</span>
      </div>

      <div className="room-section">
        <div className="room-tabs">
          <button
            className={activeTab === "create" ? "active" : ""}
            onClick={() => setActiveTab("create")}
          >
            Create Room
          </button>
          <button
            className={activeTab === "join" ? "active" : ""}
            onClick={() => setActiveTab("join")}
          >
            Join Room
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form
          onSubmit={activeTab === "create" ? handleCreateRoom : handleJoinRoom}
          className="room-form"
        >
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Room Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {activeTab === "create" ? "Create Room" : "Join Room"}
          </button>
        </form>
      </div>

      <div className="game-instructions">
        <h2>How to Play</h2>
        <ul>
          <li>Create a new room or join an existing one</li>
          <li>Each room has a hidden treasure location</li>
          <li>Players take turns guessing coordinates</li>
          <li>Find the treasure to score points</li>
          <li>Communicate with other players in the room chat</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
