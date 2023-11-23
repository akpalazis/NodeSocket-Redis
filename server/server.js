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

const users = {}; // Object to store the mapping of usernames to sockets

subredisClient.subscribe('redisMessage');
subredisClient.subscribe('redisUsers');


io.on('connection', socket => {
  socket.emit("serverName",serverName)

  socket.on('setUsername', (username) => {
    // Set the username for the socket
    socket.username = username;

    // Store the mapping of username to socket
    users[username] = socket;

    pubredisClient.sadd('connectedUsers', username);

    pubredisClient.publish('redisUsers',"");
    console.log(`${username} has connected`);

  });


  socket.on("sendMessage",(message)=>{
      pubredisClient.publish('redisMessage',
        JSON.stringify({
          message: message.message,
          toServer:message.toServer,
          user: message.user
        }));
    }
  )

  socket.on('disconnect', () => {
    const disconnectedUsername = socket.username;

    // Remove the user from the users object
    if (disconnectedUsername){
    delete users[disconnectedUsername];
    pubredisClient.srem('connectedUsers', disconnectedUsername);
    pubredisClient.publish('redisUsers',"");
    console.log(`${disconnectedUsername} has disconnected`);
    }
  });

});

subredisClient.on('message', (channel, message) => {
  if (channel === 'redisMessage') {
    const data = JSON.parse(message);
    if (data.toServer === "main") {
      io.emit('main',data)
    }
  }
  if (channel === 'redisUsers'){
    pubredisClient.smembers('connectedUsers', (err, connectedUsers) => {
    if (err) {
      console.error('Error retrieving connected users:', err);
    } else {
      // Send the list of connected users to the newly connected socket
      io.emit('users', connectedUsers);
    }
  });
  }
});