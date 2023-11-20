import { ConfigurationFull, ConfigurationWithMetricsAndValuesInclude, ConfigurationWithVersionAndCountInclude, RuleWithMetricsAndValuesInclude, database } from '@viss/db';
import { StatusCodes } from 'http-status-codes';
import {
  Body,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpMethod,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  ValidationPipe,
  createHandler,
} from 'next-api-decorators';
import { ConfigurationEntity } from "apps/configurator/entities/configuration";
import { Metrics } from 'apps/configurator/base-configuration/metrics';
import { XZoomHeaderGuard } from 'apps/configurator/decorators/XZoomHeaderGuard';
import { Metric, Prisma, Value } from '@prisma/client';
import { AllowCORS } from 'apps/configurator/decorators/AllowCORS';

class ConfigurationHandler {

  @Get('/all', {extraMethods: [HttpMethod.OPTIONS]})
  @AllowCORS()
  @HttpCode(StatusCodes.OK)
  async findMany() {
    return await database.configuration.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        active: true,
        version: {
          select: {
            id: true,
          }
        }
      }
    });
  }

  @Get('/active', {extraMethods: [HttpMethod.OPTIONS]})
  @AllowCORS()
  @HttpCode(StatusCodes.OK)
  async active() {
    const configuration = await database.configuration.findFirst({
      select: {
        id: true,
        name: true,
        version: {
          select: {
            id: true
          }
        },
        metrics: {
          select: {
            key: true,
            name: true,
            values: {
              select: {
                key: true,
                name: true,
                weight: true
              }
            }
          }
        }
      },
      where: {
        active: {
          not: null
        }
      }
    });

    if (!configuration) {
      return {};
    }
    
    const metrics = configuration.metrics.reduce((metrics, metric) => {
      metrics[metric.key] = metric.values.reduce((values, value) => {
        values[value.key] = value.weight

        return values;
      }, {});

      return metrics;
    }, {})

    return {
      ...configuration,
      metrics: metrics
    };
  }

  @Get('/:id', {extraMethods: [HttpMethod.OPTIONS]})
  @AllowCORS()
  @HttpCode(StatusCodes.OK)
  async findOne(@Param('id') id: string) {
    const configuration = await database.configuration.findUnique({
      select: {
        id: true,
        name: true,
        version: {
          select: {
            id: true
          }
        },
        metrics: {
          select: {
            key: true,
            values: {
              select: {
                key: true,
                weight: true
              }
            }
          }
        }
      },
      where: {
        id: id,
      },
    });

    if (!configuration) {
      return {};
    }

    const metrics = configuration.metrics.reduce((metrics, metric) => {
      metrics[metric.key] = metric.values.reduce((values, value) => {
        values[value.key] = value.weight

        return values;
      }, {});

      return metrics;
    }, {})

    return {
      ...configuration,
      metrics: metrics
    };
  }

  @Get('/:id/rules', {extraMethods: [HttpMethod.OPTIONS]})
  @AllowCORS()
  @HttpCode(StatusCodes.OK)
  async findRules(@Param('id') id: string) {
    const configuration = await database.configuration.findUnique({
      select: {
        id: true,
        rules: {
          select: {
            metric: true,
            activationMetric: true,
            activationValue: true
          }
        }
      },
      where: {
        id: id,
      },
    });

    if (!configuration) {
      return {};
    }

    const rules = configuration.rules.reduce((rules, rule) => {
      rules[rule.metric.key] = 
        (rules[rule.metric.key] || []).concat({
          activationMetric: rule.activationMetric.key,
          activationValue: rule.activationValue?.key || null
        });

      return rules;
    }, {});

    return {
      ...configuration,
      rules: rules
    };
  }

  @Post()
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body(ValidationPipe) body: ConfigurationEntity.Create) {
    return await database.$transaction(async prisma => {
      const metricMap = new Map<string, Metric>();
      const valueMap = new Map<string, Value>();
      
      for (const metric of body.metrics) {
        if (!await prisma.group.findUnique({ where: {id: metric.groupId} })) {
          throw new NotFoundException(`Cannot find group '${metric.groupId}'`);
        }
      }

      const newConfiguration = await prisma.configuration.create({
        data: {
          name: body.name
        }
      });

      if (!newConfiguration) {
        throw new InternalServerErrorException('Error while creating new configuration');
      }

      for (const metric of body.metrics) {
        const newMetric = await prisma.metric.create({
          data: {
            key: metric.key,
            name: metric.name,
            index: metric.index,
            configuration: {
              connect: {
                id: newConfiguration.id
              }
            },
            group: {
              connect: {
                id: metric.groupId
              }
            }
          }
        });

        if (!newMetric) {
          throw new InternalServerErrorException(`Error while creating metric '${metric.name}'`);
        }

        metricMap.set(metric.id, newMetric);

        for (const value of metric.values) {
          // Duplicating history entries will grow the database in size but SQLite doesn't support many-to-many relationships
          const valueHistory = await prisma.valueHistory.findMany({
            where: {
              value: {
                id: value.id
              }
            }
          });

          const newValue = await prisma.value.create({
            data: {
              key: value.key,
              name: value.name,
              weight: value.weight,
              configuration: {
                connect: {
                  id: newConfiguration.id
                }
              },
              metric: {
                connect: {
                  id: newMetric.id
                }
              },
              history: {
                create: valueHistory.map(history => ({
                  weight: history.weight,
                  createdAt: history.createdAt
                }))
              }
            }
          });

          if (!newValue) {
            throw new InternalServerErrorException(`Error while creating value '${value.name} (${metric.name})'`);
          }

          valueMap.set(value.id, newValue);

          if (value.default) {
            if (!await prisma.value.update({
              where: {
                id: newValue.id
              },
              data: {
                defaultToMetric: {
                  connect: {
                    id: newMetric.id
                  }
                }
              }
            })) {
              throw new InternalServerErrorException(`Error while setting '${value.name} (${metric.name})' as default value`);
            }
          }
        }
      }

      const rules = await prisma.rule.findMany({
        where: {
          configurationId: body.id
        }
      }) || [];

      for (const rule of rules) {
        const metric = metricMap.get(rule.metricId);
        const activationMetric = metricMap.get(rule.activationMetricId);
        const activationValue = valueMap.get(rule.activationValueId);

        if (metric && activationMetric) {
          const ruleArgs: Prisma.RuleCreateArgs = {
            data: {
              configuration: {
                connect: {
                  id: newConfiguration.id
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
            }
          }

          if (activationValue) {
            ruleArgs.data.activationValue = {
              connect: {
                id: activationValue.id
              }
            }
          }

          await prisma.rule.create(ruleArgs);
        }
      }

      return await prisma.configuration.findUnique({
        where: {
          id: newConfiguration.id
        },
        include: ConfigurationWithVersionAndCountInclude
      });
    }, {
      maxWait: 5000,
      timeout: 10000
    });
  }

  @Post('/new')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.CREATED)
  async new(@Body(ValidationPipe) body: ConfigurationEntity.New) {
    return await database.$transaction(async prisma => {
      const configuration = await prisma.configuration.create({
        data: {
          name: body.name,
        }
      });

      if (!configuration) {
        throw new InternalServerErrorException('Cannot create new configuration');
      }

      for (const metric of Metrics(configuration)) {
        if (!await prisma.metric.create({ data: metric })) {
          throw new InternalServerErrorException(`Error while creating metric '${metric.key}'`);
        }
      }

      const defaultValues = await prisma.value.findMany({
        where: {
          metric: null
        }
      });

      for (const value of defaultValues) {
        if (!await prisma.value.update({
          where: {
            id: value.id
          },
          data: {
            metric: {
              connect: {
                id: value.defaultToMetricId!
              }
            },
            configuration: {
              connect: {
                id: configuration.id
              }
            }
          }
        })) {
          throw new InternalServerErrorException(`Error while assigning default value '${value.id} to metric'`);
        }
      }

      return await prisma.configuration.findUnique({
        where: {
          id: configuration.id
        },
        include: ConfigurationWithVersionAndCountInclude
      });
    });
  }

  @Post('/duplicate')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.CREATED)
  async duplicate(@Body(ValidationPipe) body: ConfigurationEntity.Duplicate) {
    return await database.$transaction(async prisma => {
      const metricMap = new Map<string, Metric>();
      const valueMap = new Map<string, Value>();

      const configuration = await prisma.configuration.findUnique({
        where: {
          id: body.id
        },
        include: ConfigurationWithMetricsAndValuesInclude
      });

      if (!configuration) {
        throw new NotFoundException(`Cannot find configuration '${body.id}'`);
      }

      const newConfiguration = await prisma.configuration.create({
        data: {
          name: body.name
        }
      });

      if (!newConfiguration) {
        throw new InternalServerErrorException(`Cannot create new configuration`);
      }

      for (const metric of configuration.metrics) {
        const newMetric = await prisma.metric.create({
          data: {
            name: metric.name,
            key: metric.key,
            index: metric.index,
            group: {
              connect: {
                id: metric.group.id
              }
            },
            configuration: {
              connect: {
                id: newConfiguration.id
              }
            }
          }
        });

        if (!newMetric) {
          throw new InternalServerErrorException(`Error while duplicating metric ${metric.id}`);
        }

        metricMap.set(metric.id, newMetric);

        for (const value of metric.values) {
          const valueCreate: Prisma.ValueCreateInput = {
            key: value.key,
            name: value.name,
            weight: value.weight,
            metric: {
              connect: {
                id: newMetric.id
              }
            },
            configuration: {
              connect: {
                id: newConfiguration.id
              }
            },
          };

          if (value.defaultToMetricId) {
            valueCreate.defaultToMetric = {
              connect: {
                id: newMetric.id
              }
            }
          }

          const newValue = await prisma.value.create({ data: valueCreate });

          if (!newValue) {
            throw new InternalServerErrorException(`Error while duplicating value ${value.id}`);
          }

          valueMap.set(value.id, newValue);
        }
      }

      const rules = await prisma.rule.findMany({
        where: {
          configurationId: configuration.id
        }
      }) || [];

      for (const rule of rules) {
        const metric = metricMap.get(rule.metricId);
        const activationMetric = metricMap.get(rule.activationMetricId);
        const activationValue = valueMap.get(rule.activationValueId);

        const ruleArgs: Prisma.RuleCreateArgs = {
          data: {
            configuration: {
              connect: {
                id: newConfiguration.id
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
          }
        }

        if (activationValue) {
          ruleArgs.data.activationValue = {
            connect: {
              id: activationValue.id
            }
          }
        }

        await prisma.rule.create(ruleArgs);
      }

      return await prisma.configuration.findUnique({
        where: {
          id: newConfiguration.id
        },
        include: ConfigurationWithVersionAndCountInclude
      })
    });
  }

  @Put('/:id/version')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async assignVersion(
    @Param('id') id: string
  ) {
    return await database.$transaction(async prisma => {
      const configuration = await prisma.configuration.findUnique({
        where: {
          id: id
        },
        include: ConfigurationWithVersionAndCountInclude
      });

      if (!configuration) {
        throw new NotFoundException(`Cannot assign version to configuration '${id}'. The configuration doesn't exist`);
      }

      if (configuration.version !== null) {
        throw new ForbiddenException('Configuration is already versioned');
      }

      if (configuration.deleted || configuration.deletedAt) {
        throw new ForbiddenException('Cannot assign version to a deleted configuration');
      }

      const version = await prisma.configurationVersion.create({
        data: {
          configuration: {
            connect: {
              id: id
            }
          }
        }
      });

      if (!version) {
        throw new InternalServerErrorException('Error while assigning version to configuration');
      }

      return await prisma.configuration.findUnique({
        where: {
          id: id
        },
        include: ConfigurationWithVersionAndCountInclude
      });
    });
  }

  @Patch('/active')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async setActive(@Body(ValidationPipe) body: ConfigurationEntity.SetActive) {
    return await database.$transaction(async prisma => {
      const configuration = await prisma.configuration.findUnique({
        where: {
          id: body.id,
        },
        include: ConfigurationWithVersionAndCountInclude
      });

      if (!configuration) {
        throw new NotFoundException(`Cannot set configuration '${body.id}' active. The configuration doesn't exist`);
      }

      if (!configuration.version) {
        throw new ForbiddenException(`Cannot set configuration '${body.id}' active. The configuration hasn't a version assigned yet`);
      }

      if (configuration.deletedAt) {
        throw new ForbiddenException(`Cannot set configuration '${body.id}' active. The configuration has been deleted`);
      }

      const active = await prisma.configuration.findFirst({
        where: {
          active: {
            not: null
          }
        }
      });
  
      if (!await prisma.configuration.update({
        where: {
          id: active.id    
        },
        data: {
          active: null,
          updatedAt: active.updatedAt
        }
      })) {
        throw new InternalServerErrorException('Error while resetting active state on the current active configuration');
      }

      if (!await prisma.configuration.update({
        data: {
          active: new Date()
        },
        where: {
          id: body.id
        }
      })) {
        throw new InternalServerErrorException(`Cannot set '${body.id}' configuration active`);
      }

      return await prisma.configuration.findUnique({
        where: {
          id: body.id,
        },
        include: ConfigurationWithVersionAndCountInclude
      });
    });
  }

  @Delete('/:id')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async remove(
    @Param('id') id: string
  ) {
    const configuration = await database.configuration.findUnique({
      where: {
        id: id,
      },
    });

    if (!configuration) {
      throw new NotFoundException(`Cannot find configuration '${id}'`);
    }

    if (configuration.base) {
      throw new ForbiddenException(`Cannot delete base configuration '${id}'`);
    }

    if (configuration.base) {
      throw new ForbiddenException(`Cannot delete configuration '${id}'. The configuration is currently active`);
    }

    if (!await database.configuration.delete({
      where: {
        id: id,
      },
    })) {
      throw new InternalServerErrorException(`Error while deleting configuration '${id}'`);
    }

    return await database.configuration.findUnique({
      where: {
        id: id,
      },
      include: ConfigurationWithVersionAndCountInclude
    });
  }

  @Patch('/restore')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async restore(@Body(ValidationPipe) body: ConfigurationEntity.Restore) {
    const configuration = await database.configuration.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!configuration) {
      throw new NotFoundException(`Cannot find configuration '${body.id}'`);
    }

    if (!await database.configuration.update({
      data: {
        deletedAt: null,
        deleted: false,
      },
      where: {
        id: body.id,
      }
    })) {
      throw new InternalServerErrorException(`Cannot restore configuration '${body.id}'`);
    }

    return await database.configuration.findUnique({
      where: {
        id: body.id,
      },
      include: ConfigurationWithVersionAndCountInclude
    });
  }

  @Patch('/:id')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) body: ConfigurationEntity.Update
  ) {
    const configurationUpdate: Prisma.ConfigurationUpdateInput = {};

    let configuration = await database.configuration.findFirst({
      where: {
        id: id
      }
    });

    if (!configuration) {
      throw new NotFoundException(`Cannot find configuration '${id}'`);
    }

    body.name && 
      configuration.name !== body.name && 
      (configurationUpdate.name = body.name);
      
    body.description && 
      configuration.description !== body.description && 
      (configurationUpdate.description = body.name);

    configuration = await database.configuration.update({
      where: {
        id: id,
      },
      data: configurationUpdate,
      include: ConfigurationWithVersionAndCountInclude
    })
    
    if (!configuration) {
      throw new InternalServerErrorException(`Error while updating configuration '${id}' details`);
    }

    return configuration;
  }
}

export default createHandler(ConfigurationHandler);