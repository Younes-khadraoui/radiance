import create from "zustand";
import io, { Socket } from "socket.io-client";

interface SocketStoreState {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

const useSocketStore = create<SocketStoreState>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));

export const initializeSocket = (backendUrl: string) => {
  const socket = io(backendUrl);
  useSocketStore.setState({ socket });
  return socket;
};

export default useSocketStore;
