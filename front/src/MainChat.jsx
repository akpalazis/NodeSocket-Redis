import React, { useState, useEffect } from 'react';
import './Chat.css';

function MainChat({username,socket}) {
  const [serverNumber, setServerNumber] = useState('');
  const [inputText, setInputText] = useState('');
  const [displayTexts, setDisplayTexts] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

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

  return (
    <div className="app-container">
      <div className="sidebar">
        <h3>Connected Users</h3>
        <ul>
          {connectedUsers.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>

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
