import React, { useState, useEffect } from 'react';
import './Chat.css';
import SideBar from "./SideBar";
import PrivateChat from "./PrivateChat";

function MainChat({username,socket}) {
  const [serverNumber, setServerNumber] = useState('');
  const [inputText, setInputText] = useState('');
  const [displayTexts, setDisplayTexts] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [sideMenu,setSideMenu] = useState(true)
  const [privateChatUser, setPrivateChatUser] = useState(null);
  const [privateChatInput, setPrivateChatInput] = useState('');
  const [privateChatMessages, setPrivateChatMessages] = useState([]);

  useEffect(() => {

    socket.on('serverName', (data) => {
      setServerNumber(data);
    });

    socket.on('users', (data) => {
    if (data.includes(username)) {
      // Filter out the current user's username
      const filteredData = data.filter((user) => user !== username);
      setConnectedUsers(filteredData);
    } else {
      setConnectedUsers(data);
    }
  });

    socket.on('main', (data) => {
      setDisplayTexts([data, ...displayTexts]);
    });

  }, [displayTexts]);

  useEffect(() => {
    const handlePrivateMessage = (messages) => {
      setPrivateChatMessages([...privateChatMessages, messages]);
    };

    socket.on('private', handlePrivateMessage);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off('private', handlePrivateMessage);
    };
  }, [privateChatMessages, socket]);


  const handleChange = (event) => {
    setInputText(event.target.value);
  };

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

  return (
    <div className="app-container">
      {sideMenu? (<SideBar connectedUsers={connectedUsers} setPrivateChatUser={setPrivateChatUser} setSideMenu={setSideMenu}/>)
      :
        (<PrivateChat username={username}
                      privateChatUser={privateChatUser}
                      setSideMenu={setSideMenu}
                      sendPrivateMessage={sendPrivateMessage}
                      privateChatInput={privateChatInput}
                      setPrivateChatInput={setPrivateChatInput}
                      privateChatMessages={privateChatMessages}
                      />)
      }
    <div className="App">
        <h1>Chat Room</h1>
        <h5> Server: {serverNumber}</h5>
        <h5> Username: {username}</h5>

        <div className="display">
          {displayTexts.map((data, index) => (
            <div key={index} className={data.user === username ? 'currentUserMessage' : 'otherUserMessage'}>
              {data.user}:{data.message}
            </div>
          ))}
        </div>

        <div>
          <input
            type="text"
            value={inputText}
            onChange={handleChange}
            placeholder="Enter text..."
          />
          <button onClick={handleDisplay}>Send Text</button>
        </div>
      </div>
      </div>
  );
}


export default MainChat;
