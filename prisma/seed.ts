import { PrismaClient } from "@prisma/client";
import { Metrics } from "../apps/configurator/base-configuration/metrics";
import { Groups } from "../apps/configurator/base-configuration/groups";
import { Values } from "../apps/configurator/base-configuration/values";

const prisma = new PrismaClient();

(async function main() {

  if (await prisma.configuration.findFirst({
    where: {
      base: true
    }
  })) {
    throw new Error('Cannot seed the database. A base configuration already exists.');
  }

  const configuration = await prisma.configuration.create({
    data: {
      name: 'Default VISS Configuration',
      base: true,
      active: new Date(),
      version: {
        create: {}
      },
      description: '...',
    }
  });

  for (const g of Groups) {
    await prisma.group.create({
      data: g
    });
  }

  for (const m of Metrics(configuration)) {
    const metric = await prisma.metric.create({
      data: m
    });

    for (const vs of Values(configuration, metric)) {
      await prisma.value.create({
        data: vs
      })
    }
  }

  // Connect default values
  (await prisma.value.findMany({
    where: {
      metric: null
    }
  })).forEach(async v => await prisma.value.update({
    where: {
      id: v.id
    },
    data: {
      metric: {
        connect: {
          id: v.defaultToMetricId!
        }
      }
    }
  }));

})();