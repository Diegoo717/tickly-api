import { CreatePaymentIntentDto } from 'src/stripe/dto/create-payment-intent.dto';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  paymentIntentId: string;

  @Column({ default: 'pending' })
  status: string;  

  @Column('jsonb')
  ticketsData: CreatePaymentIntentDto[];

  @CreateDateColumn()
  createdAt: Date;
}