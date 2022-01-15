import { room } from '$lib/activity_store'
import { getCurrentValue } from '$lib/store'
import { socketIO, getSocketUrl } from '$lib/endpoints';

type socketWrapper = {
  socket: any;
  isConnected: boolean;
  isRoomJoined: boolean;
  connect: () => Promise<void>;
  startRoom: () => Promise<string>;
  joinRoom: (roomID: string) => Promise<void>;
}

export const socket: socketWrapper = {
  socket: undefined,
  isConnected: false,
  isRoomJoined: false,
  connect: async function (): Promise<void> {
    if (!socket) {
      const { io } = await import(socketIO);
      const { socketURL } = await fetch(getSocketUrl).then(response => response.json());

      this.socket = await io(socketURL);
      this.isConnected = true;
    }
  },
  startRoom: async function (): Promise<string> {
    await this.connect();

  },
  joinRoom: async function (roomID: string): Promise<void> {
    await this.connect();
  }
}