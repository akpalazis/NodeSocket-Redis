# Real-Time Communication Server

## Description

This side project demonstrates the implementation of a real-time communication server using Socket.IO and Redis. It serves as a learning resource for understanding concepts such as user connections, disconnections, private messaging, and heartbeat mechanisms in a distributed system.

## Key Components

* **Socket.IO:** Enables bidirectional communication between the server and clients in real-time.
* **Redis:** Used as a pub/sub system for inter-server communication and storing connected user data.

## Functionality

### User Connection

* Handles user connections by assigning a unique username and updating the connected user list.
* Checks for username availability to prevent duplicates.
* Notifies the frontend about the successful connection.

### User Disconnection

* Manages user disconnections by removing the user from the connected user list.
* Updates the frontend to reflect the changes in the user list.

### Private Messaging

* Facilitates private messaging between users and servers.
* Emits messages to specific users or servers using Socket.IO.

### Heartbeat

* Implements a heartbeat mechanism to detect server availability.
* Periodically sends heartbeats and checks for responses to identify disconnected servers.

## Technology Stack

* Node.js
* Socket.IO
* Redis
* React (Frontend)
* Docker Compose
* Traefik

## Scalability

The server utilizes Redis for inter-server communication and user data storage, enabling seamless scalability.

## Dockerization and Load Balancing

Docker Compose is employed to dockerize the entire application, ensuring consistent deployment and management. Traefik serves as a reverse proxy and load balancer, distributing traffic across multiple servers and handling server drops.

## Overall

This real-time communication server demonstrates the practical application of Socket.IO and Redis in building a scalable and fault-tolerant messaging system.
