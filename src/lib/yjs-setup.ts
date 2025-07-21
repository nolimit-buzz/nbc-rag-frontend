// lib/yjs-setup.ts
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { Socket } from './socket';

export class YSocketProvider {
  public doc: Y.Doc;
  public awareness: awarenessProtocol.Awareness;
  private room: string;
  private socket: Socket;

  constructor(room: string) {
    this.doc = new Y.Doc();
    this.awareness = new awarenessProtocol.Awareness(this.doc);
    this.room = room;
    this.socket = new Socket();
    this.init();
  }

  private init() {
    this.socket.joinRoom(this.room);

    this.socket.on('doc-update', (update: Uint8Array) => {
      Y.applyUpdate(this.doc, new Uint8Array(update));
      // must be the same Y.Doc passed to Tiptap
    });

    this.doc.on('update', update => {
      // const updateBuffer = Y.encodeStateAsUpdate(this.doc);
      this.socket.updateDoc(this.room, update);
    });

    this.awareness.on('update', () => {
      const states = Array.from(this.awareness.getStates().entries());
      this.socket.updateAwareness(this.room, states);
    });

    // this.socket.on('awareness-update', ({ room, states }) => {
    //   if (room === this.room) {
    //     awarenessProtocol.applyAwarenessUpdate(
    //       this.awareness,
    //       this.doc.clientID
    //     );
    //   }
    // });
  }
}
