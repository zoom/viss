import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsUppercase } from "class-validator";


export namespace RuleEntity {

  export class Create {
    @IsNotEmpty()
    @IsUUID()
    metricId: string;

    @IsNotEmpty()
    @IsUUID()
    activationMetricId: string;

    @IsOptional()
    @IsUUID()
    activationValueId: string;
  }

}