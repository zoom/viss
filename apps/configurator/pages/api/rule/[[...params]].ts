import { RuleWithMetricsAndValuesInclude, database } from '@viss/db';
import { RuleEntity } from 'apps/configurator/entities/rule';
import { XZoomHeaderGuard } from 'apps/configurator/decorators/XZoomHeaderGuard';
import { StatusCodes } from 'http-status-codes';
import {
  Body,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  ValidationPipe,
  createHandler,
} from 'next-api-decorators';
import { Prisma } from '@prisma/client';

class ValueHandler {
  
  @Get('/:id')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async findOne(@Param('id') id: string) {
    return await database.rule.findUnique({
      where: {
        id: id
      }
    });
  }

  @Delete('/:id')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async remove(@Param('id') id: string) {
    if (!await database.rule.delete({
      where: {
        id: id
      }
    })) {
      throw new InternalServerErrorException('Cannot delete rule');
    };
  }

  @Put()
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.CREATED)
  async addRule(
    @Body(ValidationPipe) body: RuleEntity.Create
  ) {
    const metric = await database.metric.findUnique({
      where: {
        id: body.metricId
      }
    });

    if (!metric) {
      throw new NotFoundException('Cannot find metric to connect rule');
    }

    const activationMetric = await database.metric.findUnique({
      where: {
        id: body.activationMetricId
      }
    });

    if (!activationMetric) {
      throw new NotFoundException('Cannot find activation metric to create rule');
    }

    const activationValue = body.activationValueId ?
      await database.value.findUnique({
        where: {
          id: body.activationValueId
        }
      }) :
      null;

    if (body.activationValueId) {

      if (!activationValue) {
        throw new NotFoundException('Cannot find activation value to create rule');
      }

      if (activationValue.deletedAt) {
        throw new ForbiddenException('Activation value must not be deleted');
      }

      if (metric.configurationId !== activationValue.configurationId) {
        throw new ForbiddenException('Activation metric and activation value don\'t belong to the same configuration');
      }
      
    }
    
    const ruleArgs: Prisma.RuleCreateArgs = {
      data: {
        configuration: {
          connect: {
            id: metric.configurationId
          }
        },
        metric: {
          connect: {
            id: metric.id
          }
        },
        activationMetric: {
          connect: {
            id: activationMetric.id
          }
        }
      },
      include: RuleWithMetricsAndValuesInclude
    };

    if (activationValue) {
      ruleArgs.data.activationValue = {
        connect: {
          id: activationValue.id
        }
      }
    }

    const rule = await database.rule.create(ruleArgs);

    if (!rule) {
      throw new InternalServerErrorException('Error while creating new rule');
    }

    return rule;
  }

}

export default createHandler(ValueHandler);
