import React from 'react';
import './Chat.css';
import MainChat from "./MainChat";
import io from 'socket.io-client';
function ChatRoom() {
  const socket = io("localhost")
  return (
    <MainChat socket={socket}/>
  );
}
export default ChatRoom;
