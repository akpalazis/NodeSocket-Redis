import React, {useState} from "react";



function SideBar({connectedUsers,setPrivateChatUser,setSideMenu}) {
  const renderPrivateChat = () => {
      if (privateChatUser) {
        return (
          <div className="private-chat-container">
            <div className="private-chat-messages">
              {privateChatMessages.map((message, index) => (
                <div key={index}>{message.fromUser}: {message.message}</div>
              ))}
            </div>
            <div className="private-chat-input">
              <input
                type="text"
                value={privateChatInput}
                onChange={(e) => setPrivateChatInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button>Send</button>
            </div>
          </div>
        );
      }
      return null;
  };

  const [privateChatInput, setPrivateChatInput] = useState('');

  function selectUser(user){
    setPrivateChatUser(user)
    setSideMenu(false)
  }

  return (
  <div className="sidebar">
      <h3>Connected Users:</h3>
    <ul>
      {connectedUsers.map((user) => (
        <li key={user} onClick={() => selectUser(user)}>
          {user}
        </li>
      ))}
    </ul>
  </div>
    )
}

export default SideBar;
