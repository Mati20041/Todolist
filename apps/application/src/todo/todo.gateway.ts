import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'todo-events' })
export class TodoGateway {
  @WebSocketServer() private server: Server;

  public newTodo(id: number) {
    this.server.emit('todo-new', { id });
  }

  public todoChanged(id: number) {
    this.server.emit('todo-update', { id });
  }

  public todoRemoved(id: number) {
    this.server.emit('todo-delete', { id });
  }
}
