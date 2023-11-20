import { database } from '@viss/db';
import { MetricEntity } from 'apps/configurator/entities/metric';
import { XZoomHeaderGuard } from 'apps/configurator/decorators/XZoomHeaderGuard';
import { StatusCodes } from 'http-status-codes';
import {
  Body,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Put,
  ValidationPipe,
  createHandler,
} from 'next-api-decorators';

class MetricHandler {

  @Get('/:id/rules')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async findRules(@Param('id') id: string) {
    return await database.rule.findMany({
      where: {
        metricId: id
      }
    });
  }

  @Put('/:id/value')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.CREATED)
  async addValue(
    @Param('id') id: string,
    @Body(ValidationPipe) body: MetricEntity.AddValue
  ) {
    const metric = await database.metric.findUnique({
      where: {
        id: id
      }
    });

    if (!metric) {
      throw new NotFoundException(`Cannot find metric '${id}'`);
    }

    const value = await database.value.create({
      data: {
        key: body.key,
        name: body.name,
        weight: body.weight,
        metric: {
          connect: {
            id: id
          }
        },
        configuration: {
          connect: {
            id: metric.configurationId
          }
        }
      }
    });

    if (!value) {
      throw new InternalServerErrorException('Error while creating new value');
    }

    // Touch parents to update timestamps
    await database.metric.touch({ id: id });
    await database.configuration.touch({ id: metric.configurationId });

    return value;
  }

  @Patch('/:id')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) body: MetricEntity.Update
  ) {
    const metric = await database.metric.update({
      where: {
        id: id,
      },
      data: {
        name: body.name
      }
    })

    if (!metric) {
      throw new InternalServerErrorException('Cannot update metric details');
    }

    await database.configuration.touch({ id: metric.configurationId });
    return metric;
  }

  @Patch('/:id/default')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async setDefault(
    @Param('id') id: string,
    @Body(ValidationPipe) body: MetricEntity.SetDefaultValue
  ) {
    const value = await database.value.findFirst({
      where: {
        id: body.id,
        metricId: id
      }
    });

    if (!value) {
      throw new NotFoundException(`Cannot set value '${body.id}' as default for metric '${id}'`);
    }

    const metric = await database.metric.update({
      where: {
        id: id
      },
      data: {
        defaultValue: {
          connect: {
            id: body.id
          }
        }
      }
    });

    return metric;
  }
  
}

export default createHandler(MetricHandler);
