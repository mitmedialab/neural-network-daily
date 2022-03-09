import { createServer, Server as httpServer } from "http";
import { TGraphConfig } from "shared/graph/graphConfigs";
import GraphFactory from "shared/graph/GraphFactory"
import establishSocketServer from "../server/socketManagement";

describe("Full Activity", () => {
  test("Backend", () => {
    const httpServer: httpServer = createServer();
    establishSocketServer(httpServer);
    const factory: GraphFactory = new GraphFactory();
    const config: TGraphConfig = factory.getConfig(6);
  })
})