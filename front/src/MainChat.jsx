import React, { useState, useEffect } from 'react';
import './Chat.css';

function MainChat({socket}) {
  const [serverNumber, setServerNumber] = useState('');
  const [inputText, setInputText] = useState('');
  const [displayTexts, setDisplayTexts] = useState([]);

  useEffect(() => {

    socket.on('serverName', (data) => {
      setServerNumber(data);
    });

    socket.on('main', (message) => {
      setDisplayTexts([message, ...displayTexts]);
    });

  }, [displayTexts]);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleDisplay = () => {
    if (inputText.trim() !== '') {
      const message = {
        message: inputText.trim(),
        toServer: 'main',
      };
      socket.emit('sendMessage', message);
      setInputText('');
    }
  };

  return (
    <div className="App">
      <h1>Chat Room | Server: {serverNumber}</h1>

      <div className="display">
        {displayTexts.map((text, index) => (
          <div key={index}>{text}</div>
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
  );
}

export default MainChat;
