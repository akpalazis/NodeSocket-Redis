import React from 'react';
import './Chat.css';

/**
 * React component representing the private chat interface.
 * Displays messages and input for a private chat with a specific user.
 * @param {Object} props - Component props.
 * @param {string} props.username - The username of the current user.
 * @param {string} props.privateChatUser - The username of the private chat recipient.
 * @param {Function} props.setSideMenu - Function to set the side menu state.
 * @param {Function} props.sendPrivateMessage - Function to send a private chat message.
 * @param {string} props.privateChatInput - Input value for the private chat message.
 * @param {Function} props.setPrivateChatInput - Function to set the private chat input value.
 * @param {Object[]} props.privateChatMessages - Array of private chat messages.
 */
function PrivateChat({
  username,
  privateChatUser,
  setSideMenu,
  sendPrivateMessage,
  privateChatInput,
  setPrivateChatInput,
  privateChatMessages,
}) {
  // Render the component
  return (
    <div className="sidebar">
      <div className="private-chat-container">
        {/* Header displaying the private chat user and an option to go back to the side menu */}
        <h5 onClick={() => setSideMenu(true)}>Private Chat with User {privateChatUser}</h5>
        {/* Display the private chat messages */}
        <div className="private-chat-messages">
          {privateChatMessages.map((message, index) => (
            // Display messages from the other user
            (message.user === privateChatUser && (
              <div key={index} className="otherUserMessage">
                {message.message}
              </div>
            )) ||
            // Display messages from the current user to the other user
            (message.user === username && message.toServer === privateChatUser && (
              <div key={index} className="currentUserMessage">
                {message.message}
              </div>
            )) ||
            // Return null for messages that don't match the conditions
            null
          ))}
        </div>
        {/* Input for typing and sending private chat messages */}
        <div className="private-chat-input">
          <input
            type="text"
            value={privateChatInput}
            onChange={(e) => setPrivateChatInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendPrivateMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default PrivateChat;
