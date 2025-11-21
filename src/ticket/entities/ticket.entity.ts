import { IsBoolean, IsOptional, IsUUID } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  @IsUUID()
  eventId: string;  

  @Column()
  eventTitle: string;

  @Column()
  eventSeat: string;

  @Column()
  eventOrder: string;

  @Column()
  eventPlace: string;

  @Column()
  eventDate: string;

  @Column()
  eventTime: string;

  @Column('decimal')
  eventCost: number;

  @Column()
  eventImageUrl: string;

  @Column()
  @IsBoolean()
  vip: boolean;

  @CreateDateColumn()
  purchasedAt: string;  

  @Column({ default: false })
  @IsOptional()
  scanned: boolean;

}