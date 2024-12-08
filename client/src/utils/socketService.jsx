import { io } from 'socket.io-client';

class SocketService {
  socket;

  connect() {
    this.socket = io('http://localhost:3002');
    return this.socket;
  }

  joinRoom(roomId, username) {
    this.socket.emit('joinRoom', { roomId, username });
  }

  leaveRoom(roomId, username) {
    this.socket.emit('leaveRoom', { roomId, username });
  }

  sendMessage(roomId, message, username) {
    this.socket.emit('sendMessage', { roomId, message, username });
  }

  onMessage(callback) {
    this.socket.on('message', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();