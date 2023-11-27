import React, { useState } from 'react';

/**
 * React component representing the sidebar of the chat interface.
 * Displays the list of connected users and provides functionality to initiate private chats.
 * @param {Object} props - Component props.
 * @param {string[]} props.connectedUsers - Array of connected users.
 * @param {Function} props.setPrivateChatUser - Function to set the private chat user.
 * @param {Function} props.setSideMenu - Function to set the side menu state.
 */
function SideBar({ connectedUsers, privateChatUser,setPrivateChatUser, setSideMenu }) {
  // State variable for private chat input
  const [privateChatInput, setPrivateChatInput] = useState('');

  /**
   * Renders the private chat interface.
   * Displays messages and input for private chat with the selected user.
   * @returns {JSX.Element} - Private chat interface.
   */
  const renderPrivateChat = () => {
    if (privateChatUser) {
      return (
        <div className="private-chat-container">
          <div className="private-chat-messages">
            {/* Display private chat messages */}
            {privateChatMessages.map((message, index) => (
              <div key={index}>{message.fromUser}: {message.message}</div>
            ))}
          </div>
          <div className="private-chat-input">
            {/* Input for private chat messages */}
            <input
              type="text"
              value={privateChatInput}
              onChange={(e) => setPrivateChatInput(e.target.value)}
              placeholder="Type your message..."
            />
            {/* Button to send private chat messages */}
            <button onClick={sendPrivateMessage}>Send</button>
          </div>
        </div>
      );
    }
    return null;
  };

  /**
   * Selects a user to initiate a private chat.
   * Sets the private chat user and hides the sidebar.
   * @param {string} user - Selected user for private chat.
   */
  function selectUser(user) {
    setPrivateChatUser(user);
    setSideMenu(false);
  }

  // Render the component
  return (
    <div className="sidebar">
      <h3>Connected Users:</h3>
      <ul>
        {/* Display connected users */}
        {connectedUsers.map((user) => (
          <li key={user} onClick={() => selectUser(user)}>
            {user}
          </li>
        ))}
      </ul>
      {/* Render the private chat interface */}
      {renderPrivateChat()}
    </div>
  );
}

export default SideBar;
