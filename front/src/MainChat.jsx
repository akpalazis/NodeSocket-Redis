import React, { useState, useEffect } from 'react';
import './Chat.css';
import SideBar from './SideBar';
import PrivateChat from './PrivateChat';

/**
 * React component representing the main chat interface.
 * Displays the chat room, connected users, and handles sending messages.
 * Also provides access to private chat functionality through the sidebar.
 * @param {Object} props - Component props.
 * @param {string} props.username - The current user's username.
 * @param {Object} props.socket - The Socket.IO client instance.
 * @param {string} props.serverNumber - The server number.
 */
function MainChat({ username, socket, serverNumber }) {
  // State variables
  const [inputText, setInputText] = useState('');
  const [displayTexts, setDisplayTexts] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [sideMenu, setSideMenu] = useState(true);
  const [privateChatUser, setPrivateChatUser] = useState(null);
  const [privateChatInput, setPrivateChatInput] = useState('');
  const [privateChatMessages, setPrivateChatMessages] = useState([]);

  /**
   * Effect: Listen for changes in connected users and main chat messages.
   * Updates the connected users and main chat messages displayed.
   */
  useEffect(() => {
    // Listen for changes in connected users
    socket.on('users', (data) => {
      if (data.includes(username)) {
        // Filter out the current user's username
        const filteredData = data.filter((user) => user !== username);
        setConnectedUsers(prevConnectedUsers => [...filteredData]);
      } else {
        setConnectedUsers(prevConnectedUsers => [...data]);
      }
    });

    // Listen for main chat messages
    socket.on('main', (data) => {
      setDisplayTexts([data, ...displayTexts]);
    });

    // Clean up event listeners when the component is unmounted
    return () => {
      socket.off('users');
      socket.off('main');
    };
  }, [displayTexts, socket, username]);

  /**
   * Effect: Listen for private messages and update the private chat messages.
   */
  useEffect(() => {
    const handlePrivateMessage = (messages) => {
      setPrivateChatMessages([...privateChatMessages, messages]);
    };

    socket.on('private', handlePrivateMessage);

    // Clean up the event listener when the component is unmounted
    return () => {
      socket.off('private', handlePrivateMessage);
    };
  }, [privateChatMessages, socket]);

  /**
   * Event handler for handling changes in the main chat input.
   * @param {Object} event - The input change event.
   */
  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  /**
   * Event handler for sending main chat messages.
   */
  const handleDisplay = () => {
    if (inputText.trim() !== '') {
      const message = {
        message: inputText.trim(),
        user: username,
        toServer: 'main',
      };
      socket.emit('sendMessage', message);
      setInputText('');
    }
  };

  /**
   * Event handler for sending private chat messages.
   */
  const sendPrivateMessage = () => {
    if (privateChatInput.trim() !== '') {
      const message = {
        message: privateChatInput.trim(),
        user: username,
        toServer: privateChatUser,
      };
      socket.emit('sendMessage', message);
      setPrivateChatInput('');
    }
  };

  // Render the component
  return (
    <div className="app-container">
      {sideMenu ? (
        // Render the sidebar when the sideMenu state is true
        <SideBar
          connectedUsers={connectedUsers}
          privateChatUser={privateChatUser}
          setPrivateChatUser={setPrivateChatUser}
          setSideMenu={setSideMenu}
        />
      ) : (
        // Render the private chat interface when the sideMenu state is false
        <PrivateChat
          username={username}
          privateChatUser={privateChatUser}
          setSideMenu={setSideMenu}
          sendPrivateMessage={sendPrivateMessage}
          privateChatInput={privateChatInput}
          setPrivateChatInput={setPrivateChatInput}
          privateChatMessages={privateChatMessages}
        />
      )}
      <div className="App">
        <h1>Chat Room</h1>
        <h5> Server: {serverNumber}</h5>
        <h5> Username: {username}</h5>

        <div className="display">
          {/* Display main chat messages */}
          {displayTexts.map((data, index) => (
            <div key={index} className={data.user === username ? 'currentUserMessage' : 'otherUserMessage'}>
              {data.user}:{data.message}
            </div>
          ))}
        </div>

        <div>
          {/* Input for main chat messages */}
          <input
            type="text"
            value={inputText}
            onChange={handleChange}
            placeholder="Enter text..."
          />
          {/* Button to send main chat messages */}
          <button onClick={handleDisplay}>Send Text</button>
        </div>
      </div>
    </div>
  );
}

export default MainChat;
