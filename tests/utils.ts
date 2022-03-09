import { Server as httpServer, createServer } from "http";
import { AddressInfo } from 'net'

export class TestingServer {
  httpsServer: httpServer;
  address: AddressInfo;
  port: number;
  url: string;

  constructor() {
    this.httpsServer = createServer();
    this.httpsServer.listen();
    this.address = this.httpsServer.address() as AddressInfo;
    if (!this.address) throw new Error("Unable to get address of test https server");
    this.port = this.address.port;
    this.url = `http://localhost:${this.port}`
  }

  close() {
    this.httpsServer.close();
  }
}