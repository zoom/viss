import { ValueWithHistoryCount, ValueWithHistoryCountInclude, database } from '@viss/db';
import { ValueEntity } from 'apps/configurator/entities/value';
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
  Patch,
  Post,
  ValidationPipe,
  createHandler,
} from 'next-api-decorators';

class ValueHandler {
  
  @Get('/:id/history')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async findHistory(@Param('id') id: string) {
    return await database.valueHistory.findMany({
      where: {
        valueId: id
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  @Post('/')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async create(
    @Body(ValidationPipe) body: ValueEntity.Create
  ) {
    const metric = await database.metric.findUnique({
      include: {
        configuration: true
      },
      where: {
        id: body.metricId
      }
    });

    if (!metric) {
      throw new NotFoundException(`Cannot find metric '${body.metricId}'`);
    }

    if (await database.configurationVersion.exists({
      configurationId: metric.configurationId
    })) {
      throw new ForbiddenException('Cannot create new values for a versioned configuration');
    }

    const value = await database.value.create({
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
        key: body.key,
        name: body.name,
        weight: body.weight
      },
      include: ValueWithHistoryCountInclude
    });

    if (!value) {
      throw new InternalServerErrorException('Error while creating value');
    }

    await database.metric.touch({ id: value.metricId });
    await database.configuration.touch({ id: value.configurationId });

    return value;
  }

  @Delete('/:id')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async remove(@Param('id') id: string) {
    const value = await database.value.delete({
      where: {
        id: id
      }
    });

    if (!value) {
      throw new InternalServerErrorException('Cannot restore value');
    };

    await database.metric.touch({ id: value.metricId });
    await database.configuration.touch({ id: value.configurationId });
  }

  @Patch('/:id/restore')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async restore(@Param('id') id: string) {
    const value = await database.value.update({
      where: {
        id: id
      },
      data: {
        deletedAt: null
      }
    });

    if (!value) {
      throw new InternalServerErrorException('Cannot restore value');
    };

    await database.metric.touch({ id: value.metricId });
    await database.configuration.touch({ id: value.configurationId });
  }

  @Patch('/')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async updateBulk(
    @Body(ValidationPipe) body: ValueEntity.UpdateBulk
  ) {
    const values: ValueWithHistoryCount[] = [];

    await database.$transaction(async prisma => {
      for (const value of body.values) {
        const {id, ...rest} = value;
        
        // Save the previous value to keep track of changes
        const _value = await prisma.value.findUnique({
          where: {
            id: id
          },
          include: {
            configuration: {
              include: {
                version: true
              }
            }
          }
        });

        if (!_value) {
          throw new NotFoundException(`Cannot find value '${id}'`);
        }

        if (_value.configuration.version) {
          throw new ForbiddenException(`Cannot update versioned configuration`);
        }

        // Do not create a new history entry if the weight is not updated
        if (_value.weight !== value.weight) {
          if (!await prisma.valueHistory.create({
            data: {
              value: {
                connect: {
                  id: id
                }
              },
              weight: _value.weight,
              createdAt: _value.createdAt 
            }
          })) {
            throw new InternalServerErrorException(`Error while creating history entry for value '${id}'`)
          };
        }

        const nValue = await prisma.value.update({
          where: {
            id: id
          },
          data: {
            ...rest,
            deletedAt: rest.deleted ? new Date() : null
          },
          include: ValueWithHistoryCountInclude
        });
        
        if (!nValue) {
          throw new InternalServerErrorException(`Error while updating value '${id}'`);
        }

        values.push(nValue);
      }
    });

    for (const value of values) {
      await database.metric.touch({ id: value.metricId });
      await database.configuration.touch({ id: value.configurationId });
    }

    return values;
  }

}

export default createHandler(ValueHandler);
