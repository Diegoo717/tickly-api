import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsUUID, ValidateNested, IsPositive } from 'class-validator';
import { CreatePaymentIntentDto } from "src/stripe/dto/create-payment-intent.dto"


export class CreateOrderDto{

    @IsUUID()
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreatePaymentIntentDto)
    ticketsData: CreatePaymentIntentDto[];

    @IsNumber()
    @IsPositive()
    totalAmount: number;

}