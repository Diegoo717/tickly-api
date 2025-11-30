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
    try {
      const { eventId } = data;
      const userId = client.data.user.userId;

      const hasAccess = await this.chatService.userHasAccessToEvent(
        userId,
        eventId,
      );

      if (!hasAccess) {
        return client.emit('error', {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this event',
        });
      }

      client.join(`event-${eventId}`);
      const messages = await this.chatService.getMessagesByEvent(eventId);
      client.emit('messageHistory', messages);
      this.server.to(`event-${eventId}`).emit('userJoined', { userId });
    } catch (error) {
      client.emit('error', {
        code: 'INTERNAL_ERROR',
        message: 'Failed to join room',
      });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe())
  async handleMessage(
    @MessageBody()
    data: { eventId: string; content: string; senderName: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user.userId;
      const { eventId, content, senderName } = data;

      const hasAccess = await this.chatService.userHasAccessToEvent(
        userId,
        eventId,
      );

      if (!hasAccess) {
        return client.emit('error', { 
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this event' 
        });
      }

      const sendMessageDto: SendMessageDto = {
        userId,
        eventId,
        content,
        senderName,
      };

      const savedMessage = await this.chatService.saveMessage(sendMessageDto);
      this.server.to(`event-${eventId}`).emit('newMessage', savedMessage);
    } catch (error) {
      client.emit('error', {
        code: 'MESSAGE_SEND_ERROR',
        message: 'Failed to send message',
      });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leaveEventRoom')
  handleLeaveRoom(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user.userId;
      const { eventId } = data;

      this.server.to(`event-${eventId}`).emit('userLeaved', { userId });
      client.leave(`event-${eventId}`);
    } catch (error) {
      client.emit('error', {
        code: 'LEAVE_ROOM_ERROR',
        message: 'Failed to leave room',
      });
    }
  }
}