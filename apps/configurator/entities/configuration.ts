import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";


export namespace ConfigurationEntity {
  
  export class New {
    @IsNotEmpty()
    @IsString()
    name: string;
  }

  class Value {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    weight: number;

    @IsNotEmpty()
    @IsBoolean()
    default: boolean;
  }

  class Metric {
    
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    index: number;

    @IsNotEmpty()
    @IsUUID()
    groupId: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Value)
    values: Value[];

  }

  export class Create {

    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Metric)
    metrics: Metric[];
    
  }

  export class Duplicate {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUUID()
    id: string;
  }

  export class SetActive {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }

  export class Restore {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }

  export class SetDefaultValue {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }

  export class Update {
    @IsOptional()
    @IsString()
    name: string;
    
    @IsOptional()
    @IsString()
    description: string;
  }

}