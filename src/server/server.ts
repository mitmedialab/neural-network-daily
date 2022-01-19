import express from 'express';
import https from 'https';
import http from 'http';

// @ts-ignore -- This will be generated by SvelteKit later
import { handler } from '../client/handler.js';
// add .js extension so it can be located after compiling typescript
import { setUpLiveReloadForDevelopment } from './devUtility.js';
import process from './processType.js';
import establishSocketServer from './socketManagement.js';

const app = express();
const server = process.env.NODE_ENV === 'dev' ? new http.Server(app) : new https.Server(app);
const port = (process.env.PORT === undefined) ? 3000 : process.env.PORT;
server.listen(port);

setUpLiveReloadForDevelopment(app);
establishSocketServer(server);
app.use(handler);


