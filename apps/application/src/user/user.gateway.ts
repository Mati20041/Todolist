import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'user-events' })
export class UserGateway {
  @WebSocketServer() private server: Server;

  public userChanged() {
    this.server.emit('user-update');
  }
}
