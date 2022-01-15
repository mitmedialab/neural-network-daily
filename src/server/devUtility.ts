import type { Express } from 'express';
// @ts-ignore
import livereload from 'livereload';
// @ts-ignore
import connectLivereload from 'connect-livereload';

export function setUpLiveReload(app: Express, directoriesToWatch: string[]) {
  app.use(connectLivereload());
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(directoriesToWatch);
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 10);
  });
}