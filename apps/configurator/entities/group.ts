import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export namespace GroupEntity {

  export class Update {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

  }

}