# Single channel chat on top of RethinkDB

This is an example how easy is to prototype a real time application with RethinkDB.
Within a few hours I was able to build a fully functional single channel chat.

Feel free to fork it and put your won beautiful chat app online today!

## What it does

A single page and single channel chat app.
Just type your nick name and start messaging.

The server is already compatible with multiple channel, but the frontend is not yet ready! What to help? :)

## How its done

The application functionality is made arround the RethinkDB change feeds capability.
It can be used to implement a PubSub, and thats exactly what it's being done here.

There is only a single table in the RethinkDB storing all the received messages. All the online users have an open web socket connection, registered in the same socket.io room (the chat channel). Each time someone types a message, it will be saved in the DB and it raises a change event that will be broadcasted to all the users.

Everyone is a publishing messages and everyone is subscribed to receive the messages.

The server is made with Node.js and Express (semi-based on https://www.npmjs.com/package/express-generator).

The web sockets are managed by socket.io (http://socket.io/).

The rest of the realtime magic is RethinkDB. To connect and interact with RethinkDB its used the Thinky ORM (https://thinky.io/).


## Installation and configuration

- Install dependencies:

  - RethinkDB 2.3.5: https://www.rethinkdb.com/docs/install/
  - Node.js 6.9.x: https://nodejs.org/en/download/

- Clone repository and run:
```bash
  $ npm install
  $ node index.js
```

The HTTP interface is running by default in the TCP port 9700
