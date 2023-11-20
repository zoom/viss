-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Value" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "metricId" TEXT,
    "defaultToMetricId" TEXT,
    "configurationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    CONSTRAINT "Value_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Value_defaultToMetricId_fkey" FOREIGN KEY ("defaultToMetricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Value_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Value" ("configurationId", "createdAt", "defaultToMetricId", "deletedAt", "id", "key", "metricId", "name", "updatedAt", "weight") SELECT "configurationId", "createdAt", "defaultToMetricId", "deletedAt", "id", "key", "metricId", "name", "updatedAt", "weight" FROM "Value";
DROP TABLE "Value";
ALTER TABLE "new_Value" RENAME TO "Value";
CREATE UNIQUE INDEX "Value_id_key" ON "Value"("id");
CREATE UNIQUE INDEX "Value_defaultToMetricId_key" ON "Value"("defaultToMetricId");
CREATE TABLE "new_Configuration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "base" BOOLEAN NOT NULL DEFAULT false,
    "active" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME
);
INSERT INTO "new_Configuration" ("active", "base", "createdAt", "deletedAt", "description", "id", "name", "updatedAt") SELECT "active", "base", "createdAt", "deletedAt", "description", "id", "name", "updatedAt" FROM "Configuration";
DROP TABLE "Configuration";
ALTER TABLE "new_Configuration" RENAME TO "Configuration";
CREATE UNIQUE INDEX "Configuration_id_key" ON "Configuration"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
