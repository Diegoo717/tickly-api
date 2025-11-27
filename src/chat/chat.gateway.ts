import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Message } from './entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinEventRoom')
  async handleJoinRoom(
    @MessageBody() data: { userId: string; eventId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, eventId } = data;
    const hasAccess = await this.chatService.userHasAccessToEvent(
      userId,
      eventId,
    );

    if (!hasAccess) {
      client.emit('error', { message: 'You do not have access to this event' });
      return;
    }

    client.join(`event-${eventId}`);
    const messages: Message[] =
      await this.chatService.getMessagesByEvent(eventId);
    client.emit('messageHistory', messages);
    this.server.to(`event-${eventId}`).emit('userJoined', userId);
  }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe())
  async handleMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, eventId } = sendMessageDto;
    const hasAccess = await this.chatService.userHasAccessToEvent(
      userId,
      eventId,
    );

    if (!hasAccess) {
      client.emit('error', { message: 'You do not have access to this event' });
      return;
    }

    const savedMessage = await this.chatService.saveMessage(sendMessageDto);
    this.server.to(`event-${eventId}`).emit('newMessage', savedMessage);
  }

  @SubscribeMessage('leaveEventRoom')
  handleLeaveRoom(
    @MessageBody() data: { userId: string; eventId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, eventId } = data;
    this.server.to(`event-${eventId}`).emit('userLeaved', userId);
    client.leave(`event-${eventId}`);
  }
}
