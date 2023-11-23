const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = 5000;
const serverName = process.env.NAME || 'Unknown';
const redis = require('redis');

const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
  });

const subredisClient = redis.createClient({
  host: 'redis',
  port: 6379,
});

const pubredisClient = redis.createClient({
  host: 'redis', // Use the hostname of your Redis container
  port: 6379,    // Default Redis port
});

server.listen(port, () => {
  console.log(serverName)
});

subredisClient.subscribe('redisMessage');

io.on('connection', socket => {
  socket.emit("serverName",serverName)

  socket.on("sendMessage",(message)=>{
      pubredisClient.publish('redisMessage',
        JSON.stringify({
          message: message.message,
          toServer:message.toServer
        }));
    }
  )
});

subredisClient.on('message', (channel, message) => {
  if (channel === 'redisMessage') {
    const data = JSON.parse(message);
    if (data.toServer === "main") {
      io.emit('main',data.message)
    }
  }
});