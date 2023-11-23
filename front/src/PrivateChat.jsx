import React from "react";
import "./Chat.css";

function PrivateChat({ username,
                       privateChatUser,
                       setSideMenu,
                       sendPrivateMessage,
                       privateChatInput,
                       setPrivateChatInput,
                       privateChatMessages}) {

  return (
    <div className="sidebar">
      <div className="private-chat-container">
        <h5 onClick={() => setSideMenu(true)}>Private Chat with User {privateChatUser}</h5>
        <div className="private-chat-messages">
          {privateChatMessages.map((message, index) => (
            (message.user === privateChatUser && (
              <div key={index} className="otherUserMessage">
                {message.message}
              </div>
            )) || (message.user === username && message.toServer === privateChatUser &&(
              <div key={index} className="currentUserMessage">
                {message.message}
              </div>
            )) || null
          ))}
        </div>
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
