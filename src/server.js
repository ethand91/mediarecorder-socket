const express = require('express');
const { createServer } = require('https');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { WebSocketServer, OPEN } = require('ws');

const { Ffmpeg } = require('./ffmpeg');

const app = express();

const createHttpsServer = () => {
  return createServer({
    cert: readFileSync(resolve(__dirname, './../ssl/cert.pem')),
    key: readFileSync(resolve(__dirname, './../ssl/cert.key'))
  });
};

const appServer = createServer({
  cert: readFileSync(resolve(__dirname, './../ssl/cert.pem')),
  key: readFileSync(resolve(__dirname, './../ssl/cert.key'))
}, app).listen(3000);

app.use(express.static(resolve(__dirname, './../public')));

const wsServer = createServer({
  cert: readFileSync(resolve(__dirname, './../ssl/cert.pem')),
  key: readFileSync(resolve(__dirname, './../ssl/cert.key'))
});

const wss = new WebSocketServer({ server: wsServer });

wss.on('connection', socket => {
  console.log('new connection');
  socket.process = new Fdmpeg();

  socket.on('message', data => {
    try {
      const jsonMessage = JSON.parse(data);
      handleJsonMessage(socket, jsonMessage);
    } catch (error) {
      console.error('failed to handle onmessage', error);
    }
  });

  socket.once('close', () => {
    console.log('socket::close');
    socket.process.kill();
  });
});

const handleJsonMessage = (socket, jsonMessage) => {
  switch(jsonMessage.action) {
    case 'chunk':
      socket.process.parseData(jsonMessage.data); 
    default:
      console.log(`unknown message', ${jsonMessage.action}`);
  }
};

const emitMessage = (socket, message) => {
  if(socket.readyState === OPEN) {
    socket.send(JSON.stringify(jsonMessage));
  }
};

wsServer.listen(8888);
console.log('App server listening on port 3000');
console.log('Ws server listening on port 8888');
