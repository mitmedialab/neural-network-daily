import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
import express from 'express';
import socketIO from 'socket.io';

import { setUpLiveReload } from './devUtility.js'; // add .js extension so it can be located after compiling typescript

import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../client/lib/sockets/socket_events';

declare var process: {
  env: {
    NODE_ENV: string
  }
}

const unSecurePort: number = 40;
const securePort: number = 443;

const __filename: string = fileURLToPath(import.meta.url);
const __server_dir: string = path.dirname(__filename);
const __client_dir = path.join(path.dirname(__server_dir), "client");

const app = express();
setUpLiveReload(app, [__client_dir, __server_dir]);
app.use(express.static(__client_dir));
const httpServer: http.Server = http.createServer(app);
httpServer.listen(unSecurePort);

console.log(__client_dir);

