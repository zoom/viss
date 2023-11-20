import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsUppercase, ValidateNested } from "class-validator";

export namespace ValueEntity {
  
  class Value {

    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsUUID()
    @IsOptional()
    metricId: string;

    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    key: string;

    @IsNotEmpty()
    @IsNumber()
    weight: number;
    
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    deleted: boolean;

  }

  export class Create {

    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    key: string;

    @IsNotEmpty()
    @IsNumber()
    weight: number;
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    metricId: string;

  }

  export class UpdateBulk {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Value)
    values: Value[];

  }

  export class CreateBulk {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Value)
    values: Value[];

  }

}