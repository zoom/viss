/*
  Warnings:

  - You are about to drop the column `valueId` on the `Rule` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" INTEGER NOT NULL,
    "configurationId" TEXT,
    "metricId" TEXT,
    "activationMetricId" TEXT,
    "activationValueId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rule_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rule_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rule_activationMetricId_fkey" FOREIGN KEY ("activationMetricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rule_activationValueId_fkey" FOREIGN KEY ("activationValueId") REFERENCES "Value" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Rule" ("configurationId", "createdAt", "id", "metricId", "type", "updatedAt") SELECT "configurationId", "createdAt", "id", "metricId", "type", "updatedAt" FROM "Rule";
DROP TABLE "Rule";
ALTER TABLE "new_Rule" RENAME TO "Rule";
CREATE UNIQUE INDEX "Rule_id_key" ON "Rule"("id");
CREATE UNIQUE INDEX "Rule_activationValueId_key" ON "Rule"("activationValueId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
