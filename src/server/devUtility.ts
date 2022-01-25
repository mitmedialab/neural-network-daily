import path from 'path';
import { fileURLToPath } from 'url';
import type { Express } from 'express';
// @ts-ignore
import livereload from 'livereload';
// @ts-ignore
import connectLivereload from 'connect-livereload';
import process from './processType.js';

/**
 * 
 * @param app 
 */
export function setUpLiveReloadForDevelopment(app: Express) {
  if (process.env.NODE_ENV !== 'dev') return;
  app.use(connectLivereload());

  const __server_dir: string = path.dirname(fileURLToPath(import.meta.url));
  const __client_dir = path.join(path.dirname(__server_dir), "client");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch([__server_dir, __client_dir]);
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

export const isDevelopmentMode = process.env.NODE_ENV === 'dev';
export const devConsole: Console | undefined = isDevelopmentMode ? console : undefined;
