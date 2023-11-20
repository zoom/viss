import { Prisma } from "@prisma/client";
import { Configuration } from "@prisma/client";
import { group } from "console";

export const Metrics = (configuration: Configuration): Prisma.MetricCreateInput[] => {
  return [
    { 
      index: 0,
      key: 'PLI',
      name: 'Platform Impacted',
      group: {
        connect: {
          key: 'platform-impacted'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 1,
      key: 'ICI',
      name: 'Confidentiality',
      group: {
        connect: {
          key: 'platform-impact'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'N', name: 'None', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 2,
      key: 'III',
      name: 'Integrity',
      group: {
        connect: {
          key: 'platform-impact'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'N', name: 'None', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 3,
      key: 'IAI',
      name: 'Availability',
      group: {
        connect: {
          key: 'platform-impact'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'N', name: 'None', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 4,
      key: 'ITN',
      name: 'Infrastructure',
      group: {
        connect: {
          key: 'tenancy'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 5,
      key: 'STN',
      name: 'Software',
      group: {
        connect: {
          key: 'tenancy'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 6,
      key: 'DTN',
      name: 'Database',
      group: {
        connect: {
          key: 'tenancy'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 7,
      key: 'TIM',
      name: 'Tenants Impacted',
      group: {
        connect: {
          key: 'tenants-impacted'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'N', name: 'None', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 8,
      key: 'DCI',
      name: 'Confidentiality',
      group: {
        connect: {
          key: 'data-impact'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 9,
      key: 'DII',
      name: 'Integrity',
      group: {
        connect: {
          key: 'data-impact'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 10,
      key: 'DAI',
      name: 'Availability',
      group: {
        connect: {
          key: 'data-impact'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 11,
      key: 'DCL',
      name: 'Data Classification',
      group: {
        connect: {
          key: 'data-classification'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'N', name: 'None', weight: 0, configuration: { connect: { id: configuration.id } }
        }
      }
    },
    { 
      index: 12,
      key: 'UCI',
      name: 'Compensating Controls',
      group: {
        connect: {
          key: 'compensating-controls'
        }
      },
      configuration: {
        connect: {
          id: configuration.id
        }
      },
      defaultValue: {
        create: {
          key: 'NA', name: 'N/A', weight: 1, configuration: { connect: { id: configuration.id } }
        }
      }
    }
  ]
}