import React, { useState } from 'react';
import './Chat.css';
import MainChat from "./MainChat";
import io from 'socket.io-client';

function ChatRoom() {
  const [username, setUsername] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [socket, setSocket] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleConnect = () => {
    // You can perform validation here based on your requirements.
    // For simplicity, let's consider a valid username if it's not empty.
    if (username.trim() !== '') {
      const newSocket = io("localhost");
      setSocket(newSocket);
      setIsValidUsername(true);
      newSocket.emit("setUsername",username)
    } else {
      // Handle invalid username case
      alert('Please enter a valid username.');
    }
  };

  return (
    <div>
      {!isValidUsername ? (
        <div>
          <label>
            Enter your username:
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
          <button onClick={handleConnect}>Connect</button>
        </div>
      ) : (
        <MainChat username={username} socket={socket} />
      )}
    </div>
  );
}

export default ChatRoom;
