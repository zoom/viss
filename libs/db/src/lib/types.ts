import { Prisma, Value } from "@prisma/client";

export const ConfigurationWithMetricsAndValuesInclude = Prisma.validator<Prisma.ConfigurationInclude>()({
  metrics: {
    include: {
      group: true,
      defaultValue: true,
      values: {
        where: {
          deletedAt: null
        }
      }
    }
  }
});

export const ConfigurationWithVersionAndCountInclude = Prisma.validator<Prisma.ConfigurationInclude>()({
  version: true,
  _count: {
    select: {
      rules: true,
      values: true
    }
  }
});

export type ConfigurationWithVersionAndCount = Prisma.ConfigurationGetPayload<{
  include: typeof ConfigurationWithVersionAndCountInclude
}>;

export const ConfigurationBasicSelect = Prisma.validator<Prisma.ConfigurationSelect>()({
  version: {
    select: {
      id: true
    }
  },
  metrics: {
    select: {
      defaultValue: {
        select: {
          key: true
        }
      },
      group: {
        select: {
          key: true,
          description: true
        }
      },
      key: true,
      name: true,
      values: {
        select: {
          key: true,
          name: true,
          weight: true
        },
        orderBy: {
          weight: 'asc'
        },
        where: {
          deletedAt: null
        }
      }
    }
  }
});

export type ConfigurationBasic = Prisma.ConfigurationGetPayload<{
  select: typeof ConfigurationBasicSelect
}>;

export const RuleBasicSelect = Prisma.validator<Prisma.RuleSelect>()({
  metric: {
    select: {
      key: true
    }
  },
  activationMetric: {
    select: {
      key: true
    }
  },
  activationValue: {
    select: {
      key: true
    }
  }
});

export type RuleBasic = Prisma.RuleGetPayload<{
  select: typeof RuleBasicSelect
}>;

export const VersionWithConfigurationSelect = Prisma.validator<Prisma.ConfigurationVersionSelect>()({
  id: true,
  configuration: {
    select: {
      createdAt: true,
      metrics: {
        select: {
          key: true,
          name: true,
          values: {
            select: {
              key: true,
              name: true,
              weight: true
            },
            where: {
              deleted: false
            },
            orderBy: {
              weight: 'asc'
            }
          }
        }
      }
    },
  }
});

export type VersionWithConfiguration = Prisma.ConfigurationVersionGetPayload<{
  select: typeof VersionWithConfigurationSelect
}>

export const ConfigurationFullInclude = Prisma.validator<Prisma.ConfigurationInclude>()({
  version: true,
  metrics: {
    include: {
      defaultValue: true,
      group: true,
      rules: true,
      values: {
        include: {
          _count: {
            select: {
              history: true
            }
          }
        },
        orderBy: {
          weight: 'asc',
        },
      },
      _count: {
        select: {
          rules: true
        }
      }
    },
    orderBy: {
      index: 'asc',
    },
  }
});

export type ConfigurationFull = Prisma.ConfigurationGetPayload<{
  include: typeof ConfigurationFullInclude
}>;

export type ConfigurationFullWithSavedProps = Omit<ConfigurationFull, 'metrics'> & {
  metrics: MetricWithValuesAndCountAndSavedProps[]
};

export const ConfigurationWithoutDeletedValuesInclude = Prisma.validator<Prisma.ConfigurationInclude>()({
  version: true,
  metrics: {
    include: {
      values: {
        where: {
          deleted: false
        },
        orderBy: {
          weight: 'asc',
        },
      },
    },
    orderBy: {
      index: 'asc',
    },
  }
});

export type ConfigurationWithoutDeletedValues = Prisma.ConfigurationGetPayload<{
  include: typeof ConfigurationWithoutDeletedValuesInclude
}>;

export const RuleWithMetricsAndValuesInclude = Prisma.validator<Prisma.RuleInclude>()({
  metric: true,
  activationMetric: true,
  activationValue: true,
});

export type RuleWithMetricsAndValues = Prisma.RuleGetPayload<{
  include: typeof RuleWithMetricsAndValuesInclude,
}>

export const ValueWithHistoryCountInclude = Prisma.validator<Prisma.ValueInclude>()({
  _count: {
    select: {
      history: true
    }
  }
});

export type ValueWithHistoryCount = Prisma.ValueGetPayload<{
  include: typeof ValueWithHistoryCountInclude
  orderBy: {
    weight: 'asc',
  }
}>;

export type ValueWithHistoryCountAndSavedProps = ValueWithHistoryCount & {
  savedProps: Pick<Value, 'key' | 'name' | 'weight' | 'deleted'>
};

export const MetricWithValuesAndCountInclude = Prisma.validator<Prisma.MetricInclude>()({
  defaultValue: true,
  values: {
    include: {
      _count: {
        select: {
          history: true
        }
      }
    }
  },
  _count: {
    select: {
      rules: true
    }
  }
});

export type MetricWithValuesAndCount = Prisma.MetricGetPayload<{
  include: typeof MetricWithValuesAndCountInclude
}>;

export type MetricWithValuesAndCountAndSavedProps = Omit<MetricWithValuesAndCount, 'values'> & {
  values: ValueWithHistoryCountAndSavedProps[]
}

export const MetricWithGroupAndDefaultValueInclude = Prisma.validator<Prisma.MetricInclude>()({
  group: {
    select: {
      id: true,
      name: true
    }
  },
  defaultValue: true,
  rules: true,
  _count: {
    select: {
      values: true
    }
  }
});

export type MetricWithGroupAndDefaultValue = Prisma.MetricGetPayload<{
  include: typeof MetricWithGroupAndDefaultValueInclude
}>;