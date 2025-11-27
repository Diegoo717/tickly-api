import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  eventId: string;

  @Column('text')
  content: string;

  @Column()
  senderName: string;
  
  @CreateDateColumn()
  createdAt: Date;
}