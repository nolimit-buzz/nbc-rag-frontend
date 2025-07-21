// lib/socket.ts
import { io, Socket as SocketIOClient } from 'socket.io-client';

export class Socket {
  private static instance: SocketIOClient;

  public connect(): SocketIOClient {
    if (!Socket.instance) {
      Socket.instance = io(process.env.NEXT_PUBLIC_API_URL!, {
        transports: ['websocket'],
        auth: {
          token: localStorage.getItem('accessToken'),
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      Socket.instance.on('connect', () => {
        console.log('✅ Socket.IO connected:', Socket.instance.id);
      });

      Socket.instance.on('disconnect', (reason) => {
        console.log('❌ Disconnected:', reason);
      });

      Socket.instance.on('connect_error', (err) => {
        console.error('❌ Connection error:', err);
      });

      console.log('📡 Socket.IO client initialized');
    }
    return Socket.instance;
  }
  public on(event: string, callback: (...args: any[]) => void) {
    Socket.instance.on(event, callback);
  }
  public updateDoc(room: string, update: Uint8Array) {
    try {
      // const decodedUpdate = new Uint8Array(update); // Convert back from number[]
      // Y.applyUpdate(doc, decodedUpdate);
    } catch (err) {
      console.error('❌ Failed to apply update:', err);
    }
    Socket.instance.emit('doc-update', { room, update: Array.from(update) });
    
  }
  public updateAwareness(room: string, states: any) {
    Socket.instance.emit('awareness-update', {
      room,
      states,
    });
  }

  public joinRoom(roomName: string) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) return;

    Socket.instance.emit('join-room', {
      roomName,
      userId,
    });
  }

  public disconnect() {
    if (Socket.instance) {
      Socket.instance.disconnect();
      Socket.instance = undefined!;
    }
  }

  public getInstance() {
    return Socket.instance;
  }
}
