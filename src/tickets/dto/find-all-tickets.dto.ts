import { IsUUID } from "class-validator";

export class FindAllTicketsDto{

    @IsUUID()
    userId: string;

}