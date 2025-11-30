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
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';

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

  @UseGuards(WsAuthGuard)  
  @SubscribeMessage('joinEventRoom')
  async handleJoinRoom(
    @MessageBody() data: { eventId: string },  
    @ConnectedSocket() client: Socket,
  ) {
    const { eventId } = data;
    const userId = client.data.user.userId; 

    console.log('👤 Authenticated user trying to join:', userId);
    console.log('🎪 Event ID:', eventId);

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
    this.server.to(`event-${eventId}`).emit('userJoined', { userId });
  }

  @UseGuards(WsAuthGuard) 
  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe())
  async handleMessage(
    @MessageBody() data: { eventId: string; content: string; senderName: string },  
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.userId;  
    const { eventId, content, senderName } = data;

    console.log('📨 User sending message:', userId);

    const hasAccess = await this.chatService.userHasAccessToEvent(
      userId,
      eventId,
    );

    if (!hasAccess) {
      client.emit('error', { message: 'You do not have access to this event' });
      return;
    }

    const sendMessageDto: SendMessageDto = {
      userId,
      eventId,
      content,
      senderName,
    };

    const savedMessage = await this.chatService.saveMessage(sendMessageDto);
    this.server.to(`event-${eventId}`).emit('newMessage', savedMessage);
  }

  @UseGuards(WsAuthGuard)  
  @SubscribeMessage('leaveEventRoom')
  handleLeaveRoom(
    @MessageBody() data: { eventId: string },  
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.userId;  
    const { eventId } = data;

    console.log('👋 User leaving room:', userId);

    this.server.to(`event-${eventId}`).emit('userLeaved', { userId });
    client.leave(`event-${eventId}`);
  }
}