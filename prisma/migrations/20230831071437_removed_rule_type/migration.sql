/*
  Warnings:

  - You are about to drop the column `type` on the `Rule` table. All the data in the column will be lost.
  - Added the required column `index` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Group" ("createdAt", "description", "id", "key", "name", "updatedAt") SELECT "createdAt", "description", "id", "key", "name", "updatedAt" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_id_key" ON "Group"("id");
CREATE UNIQUE INDEX "Group_key_key" ON "Group"("key");
CREATE TABLE "new_Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_Rule" ("activationMetricId", "activationValueId", "configurationId", "createdAt", "id", "metricId", "updatedAt") SELECT "activationMetricId", "activationValueId", "configurationId", "createdAt", "id", "metricId", "updatedAt" FROM "Rule";
DROP TABLE "Rule";
ALTER TABLE "new_Rule" RENAME TO "Rule";
CREATE UNIQUE INDEX "Rule_id_key" ON "Rule"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
