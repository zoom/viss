import { Prisma } from "@prisma/client";

export const Groups: Prisma.GroupCreateInput[] = [
  { name: 'Platform Impacted', index: 0, key: 'platform-impacted' },
  { name: 'Platform Impact', index: 1, key: 'platform-impact' },
  { name: 'Tenancy', index: 2, key: 'tenancy' },
  { name: 'Tenants Impacted', index: 3, key: 'tenants-impacted' },
  { name: 'Data Impact', index: 4, key: 'data-impact' },
  { name: 'Data Classification', index: 5, key: 'data-classification' },
  { name: 'Compensating Controls', index: 6, key: 'compensating-controls' },
]