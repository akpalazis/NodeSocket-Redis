/*
 * Real-Time Communication Server
 * -------------------------------------
 * Description:
 * This script is a side project created for educational purposes to demonstrate the
 * implementation of a real-time communication server using Socket.IO and Redis. It serves
 * as a learning resource for understanding concepts such as user connections, disconnections,
 * private messaging, and heartbeat mechanisms in a distributed system.
 *
 * Note: This is not intended for production use and may lack certain optimizations or
 * security measures commonly found in production-grade systems
 *
 * Key Components:
 * - Socket.IO: Enables bidirectional communication between the server and clients in real-time.
 * - Redis: Used as a pub/sub system for inter-server communication and storing connected user data.
 *
 * Functionality:
 * 1. User Connection:
 *    - Handles user connections by assigning a unique username and updating the connected user list.
 *    - Checks for username availability to prevent duplicates.
 *    - Notifies the frontend about the successful connection.
 *
 * 2. User Disconnection:
 *    - Manages user disconnections by removing the user from the connected user list.
 *    - Updates the frontend to reflect the changes in the user list.
 *
 * 3. Private Messaging:
 *    - Facilitates private messaging between users and servers.
 *    - Emits messages to specific users or servers using Socket.IO.
 *
 * 4. Heartbeat:
 *    - Implements a heartbeat mechanism to detect server availability.
 *    - Periodically sends heartbeats and checks for responses to identify disconnected servers.
 *
 * Author: Andreas Palazis
 * Date: 27.11.2023
 */


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

const redisSubscriber = redis.createClient({
  host: 'redis',
  port: 6379,
});

const redisPublisher = redisSubscriber.duplicate()


server.listen(port, () => {
  console.log(`Server: ${serverName} connected!`)
});

const serverUsers = {};
const heartbeatInterval = 100;
const heartbeatThreshold = 200;


redisSubscriber.subscribe('redisMessage');
redisSubscriber.subscribe('redisUsers');

io.on('connection', socket => {
  socket.emit('requestUsername','')

  socket.on('setUsername', (username) => {
     /**
    * Map a username with a socket
    */
    function mapUsernameSocket() {
      socket.username = username;
      serverUsers[username] = socket;
    }
     /**
    * Holds the user names on memory
    */
    function publishUserToRedis(){
      redisPublisher.sadd('connectedUsers', username);
      redisPublisher.sadd(`UsersOnServer_${serverName}`, username)
    }
     /**
    * Emits signal to the frontend if the username is available and the name of the current server
    */
    function emitToFrontEnd() {
      socket.emit("isValid", true)
      socket.emit("serverName", serverName)
    }

    // fetch app users
    redisPublisher.smembers('connectedUsers', (err, appUsers) => {
      if (err) {
        console.error('Error retrieving connected users:', err);
      } else {
        if (appUsers.includes(username)) {
          // username taken
          socket.emit("isValid",false)
        } else {
            // username available
            mapUsernameSocket()
            publishUserToRedis()
            updateFrontEndUsers()
            emitToFrontEnd()
            console.log(`${username} has connected`);
        }
      }
    });

  });


  socket.on("sendMessage",(message)=>{
      redisPublisher.publish('redisMessage',
        JSON.stringify({
          message: message.message,
          toServer:message.toServer,
          user: message.user
        }));
    }
  )

  socket.on('disconnect', () => {
     /**
    * Removes a user from the memory
    */
    function removeUserFromRedis(){
      redisPublisher.srem('connectedUsers', disconnectedUsername);
      redisPublisher.srem(`UsersOnServer_${serverName}`,disconnectedUsername)
    }

    const disconnectedUsername = socket.username;

    if (disconnectedUsername){
      delete serverUsers[disconnectedUsername];
      removeUserFromRedis()
      updateFrontEndUsers()
      console.log(`${disconnectedUsername} has disconnected`);
    }
  });

});

/**
 * Updates the server heartbeats and checks if the heartbeat is on time
 */
function sendHeartbeat() {
  redisPublisher.hset('server_heartbeats', `UsersOnServer_${serverName}`, Date.now());
  checkHeartbeat()
}
setInterval(sendHeartbeat, heartbeatInterval);


/**
* Checks if a heartbeat of a server is on time, otherwise it will handle it as disconnected server
*/
function checkHeartbeat() {
  redisPublisher.hgetall('server_heartbeats', (err, serverHeartbeats) => {
    if (err) {
      console.error(err);
    } else {
      for (const serverId in serverHeartbeats) {
        const lastHeartbeatTimestamp = parseInt(serverHeartbeats[serverId]);
        const timeSinceHeartbeat = Date.now() - lastHeartbeatTimestamp;

        if (timeSinceHeartbeat > heartbeatThreshold) {
          handleDisconnectedServer(serverId)
        }
      }
    }
  })
  /**
 * Handle the disconnection of a server by removing its users, removing the server from the heartbeats
 * and updating the frontend.
 * @param {string} serverId - The ID of the disconnected server.
 */
  function handleDisconnectedServer(serverId) {
    redisPublisher.smembers(`${serverId}Users`, (err, connectedUsers) => {
      if (err) {
        console.error('Error retrieving connected users:', err);
        return;
      }
      removeUsersOfDisconnectedServer(connectedUsers);
      removeDisconnectedServerFromHeartbeats(serverId);
      updateFrontEndUsers();
  });
}

/**
 * removes users of a disconnected server
 * @param {list} connectedUsers - a list of connected users on the particular server.
 */
  function removeUsersOfDisconnectedServer(connectedUsers) {
    for (const user of connectedUsers) {
      redisPublisher.srem('connectedUsers', user);  // Remove the users of the dropped server
    }
  }

   /**
   * removes a server from the heartbeat mechanism
   * @param {string} serverId - The ID of the disconnected server.
   */
  function removeDisconnectedServerFromHeartbeats(serverId) {
    redisPublisher.hdel('server_heartbeats', serverId); // Remove the dropped server from the heartbeats
  }
}

 /**
 * Updates the frontend with the latest connected users
 */
function updateFrontEndUsers() {
  redisPublisher.smembers('connectedUsers', (err, connectedUsers) => {
    if (err) {
      console.error('Error retrieving connected users:', err);
    } else {
      // Send the list of connected users to the newly connected socket
      io.emit('users', connectedUsers);
    }
  })
}

redisSubscriber.on('message', (channel, message) => {
  const data = JSON.parse(message);

  if (channel === 'redisMessage') {

    if (data.toServer === "main") {
      io.emit('main', data) // emit to all servers
    }

    if (data.user in serverUsers) {
      const currentSocket = serverUsers[data.user]
      currentSocket.emit('private', data) // emit to the server that the user exists
    }

    if (data.toServer in serverUsers) {
      const currentSocket = serverUsers[data.toServer]
      currentSocket.emit('private', data) // emit to the server that the user exists
    }
  }
})
