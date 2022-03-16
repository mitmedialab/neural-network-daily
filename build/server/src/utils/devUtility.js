import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import livereload from 'livereload';
// @ts-ignore
import connectLivereload from 'connect-livereload';
import process from './processType.js';
export function setUpLiveReloadForDevelopment(app) {
    if (process.env.NODE_ENV !== 'dev')
        return;
    app.use(connectLivereload());
    const __server_dir = path.dirname(fileURLToPath(import.meta.url));
    const __client_dir = path.join(path.dirname(__server_dir), "client");
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch([__server_dir, __client_dir]);
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 20);
    });
}
export const isDevelopmentMode = process.env.NODE_ENV === 'dev';
export const devConsole = isDevelopmentMode ? console : undefined;
//# sourceMappingURL=devUtility.js.map