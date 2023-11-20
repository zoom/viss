import { Configuration, Metric, Prisma } from "@prisma/client";

export const Values = (configuration: Configuration, metric: Metric): Prisma.ValueCreateInput[] => {
  return ({
    PLI: [
      { key: 'T', name: '3rd Party', weight: 0.85, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'D', name: 'Desktop', weight: 1.1, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'M', name: 'Mobile', weight: 1.1, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'W', name: 'Web', weight: 1.1, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'C', name: 'Cloud Infra', weight: 1.2, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    ICI: [
      { key: 'D', name: 'Network/DNS Configuration', weight: 0.125, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'H', name: 'Hardware Configuration', weight: 0.25, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'C', name: 'Container Configuration', weight: 0.325, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'O', name: 'OS Configuration', weight: 0.5, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'S', name: 'Software Configuration', weight: 0.625, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'P', name: 'PKI/Secrets Configuration', weight: 0.75, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'U', name: 'User Account Configuration', weight: 0.875, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    III: [
      { key: 'D', name: 'Network/DNS Configuration', weight: 0.125, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'H', name: 'Hardware Configuration', weight: 0.25, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'C', name: 'Container Configuration', weight: 0.325, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'O', name: 'OS Configuration', weight: 0.5, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'S', name: 'Software Configuration', weight: 0.625, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'P', name: 'PKI/Secrets Configuration', weight: 0.75, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'U', name: 'User Account Configuration', weight: 0.875, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    IAI: [
      { key: 'SSS', name: 'Single Service on Single Container/VM/Machine', weight: 0.062, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'SSM', name: 'Single Service on Multiple Containers/VMs/Machines', weight: 0.124, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'SSAPG', name: 'Single Service on all Containers/VMs/Machines within a portion of a Geographic Area', weight: 0.186, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'SSAEG', name: 'Single Service on all Containers/VMs/Machines within an entire Geographic Area', weight: 0.248, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'SSAEI', name: 'Single Service on all Containers/VMs/Machines within the entire Infrastructure', weight: 0.31, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MSS', name: 'Multiple Services on Single Container/VM/Machine', weight: 0.372, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MSM', name: 'Multiple Services on Multiple Containers/VMs/Machines', weight: 0.434, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MSAPG', name: 'Multiple Services on all Containers/VMs/Machines within a portion of a Geographic Area', weight: 0.496, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MSAEG', name: 'Multiple Services on all Containers/VMs/Machines within an entire Geographic Area', weight: 0.558, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MSAEI', name: 'Multiple Services on all Containers/VMs/Machines within the entire Infrastructure', weight: 0.62, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'ASS', name: 'All Services on Single Container/VM/Machine', weight: 0.682, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'ASM', name: 'All Services on Multiple Containers/VMs/Machines', weight: 0.744, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'ASAPG', name: 'All Services on all Containers/VMs/Machines within a portion of a Geographic Area', weight: 0.806, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'ASAEG', name: 'All Services on all Containers/VMs/Machines within an entire Geographic Area', weight: 0.868, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'ASAEI', name: 'All Services on all Containers/VMs/Machines within the entire Infrastructure', weight: 0.93, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    ITN: [
      { key: 'S', name: 'Single', weight: 0.374, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'M', name: 'Multi', weight: 0.812, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    STN: [
      { key: 'S', name: 'Single', weight: 0.374, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'M', name: 'Multi', weight: 0.812, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    DTN: [
      { key: 'S', name: 'Single', weight: 0.374, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'M', name: 'Multi', weight: 0.812, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    TIM: [
      { key: 'D', name: 'Dev Only', weight: 0.7, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'O', name: 'One', weight: 1, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'M', name: 'Many', weight: 1.3, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'A', name: 'All', weight: 1.5, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    DCI: [
      { key: 'SU', name: 'Single User', weight: 0.275, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MU', name: 'Multiple Users', weight: 0.492, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'SO', name: 'Single Organization', weight: 0.604, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MO', name: 'Multiple Organizations', weight: 0.66, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'AO', name: 'All Organizations', weight: 0.796, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    DII: [
      { key: 'SU', name: 'Single User', weight: 0.275, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MU', name: 'Multiple Users', weight: 0.492, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'SO', name: 'Single Organization', weight: 0.604, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MO', name: 'Multiple Organizations', weight: 0.66, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'AO', name: 'All Organizations', weight: 0.796, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    DAI: [
      { key: 'SU', name: 'Single User', weight: 0.275, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MU', name: 'Multiple Users', weight: 0.492, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'SO', name: 'Single Organization', weight: 0.604, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'MO', name: 'Multiple Organizations', weight: 0.66, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'AO', name: 'All Organizations', weight: 0.796, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    DCL: [
      { key: 'T', name: 'Test Data Only', weight: 0.5, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'P', name: 'Public', weight: 0.8, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'C', name: 'Customer', weight: 1.1, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'I', name: 'Internal', weight: 1.3, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'S', name: 'Confidential', weight: 1.5, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'R', name: 'Restricted', weight: 1.7, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
    ,
    UCI: [
      { key: 'P', name: 'Prevents Impact', weight: 0.65, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } },
      { key: 'L', name: 'Limits Impact', weight: 0.8, configuration: { connect: { id: configuration.id } }, metric: { connect: { id: metric.id } } }
    ]
  } as Record<string, Prisma.ValueCreateInput[]>)[metric.key];
}