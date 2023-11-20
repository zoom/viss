import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsUppercase } from "class-validator";


export namespace MetricEntity {

  export class Update {
    @IsString()
    name: string;
  }

  export class AddValue {
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    weight: number;
  }

  export class SetDefaultValue {
    @IsNotEmpty()
    @IsUUID()
    id: string
  }

}