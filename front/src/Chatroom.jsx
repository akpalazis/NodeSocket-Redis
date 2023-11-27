import React, { useState } from 'react';
import './Chat.css';
import MainChat from './MainChat';
import io from 'socket.io-client';

/**
 * React component representing the chat room interface.
 * Allows users to connect to the real-time communication server using a unique username.
 * Displays the main chat interface upon successful connection.
 */
function ChatRoom() {
  // State variables
  const [username, setUsername] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [socket, setSocket] = useState(null);
  const [serverNumber, setServerNumber] = useState('');

  /**
   * Event handler for username input changes.
   * @param {Object} event - The input change event.
   */
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  /**
   * Handles the connection to the real-time communication server when the "Connect" button is clicked.
   * Emits a 'setUsername' event to the server with the chosen username.
   */
  const handleConnect = () => {
    if (username.trim() !== '') {
      // Establish a new Socket.IO connection
      const newSocket = io();
      setSocket(newSocket);

      // Listen for the 'requestUsername' event and respond with the chosen username
      newSocket.on('requestUsername', () => {
        newSocket.emit('setUsername', username);
      });

      // Listen for the 'isValid' event to check if the chosen username is valid
      newSocket.on('isValid', (message) => {
        setIsValidUsername(message);

        // If the username is not valid, disconnect the socket and reset the state
        if (!message) {
          alert('Username is not available. Please choose a different username.');
          newSocket.disconnect();
          setSocket(null);
        }
      });

      // Listen for the 'serverName' event to get the server number upon successful connection
      newSocket.on('serverName', (data) => {
        setServerNumber(data);
      });
    } else {
      // Handle case when the username is empty
      alert('Please enter a valid username.');
    }
  };

  return (
    <div>
      {!isValidUsername ? (
        // Render the username input and connect button if the username is not yet valid
        <div>
          <label>
            Enter your username:
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
          <button onClick={handleConnect}>Connect</button>
        </div>
      ) : (
        // Render the MainChat component if the username is valid
        <MainChat username={username} socket={socket} serverNumber={serverNumber} />
      )}
    </div>
  );
}

export default ChatRoom;
