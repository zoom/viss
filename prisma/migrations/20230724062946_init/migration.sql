-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "base" BOOLEAN NOT NULL DEFAULT false,
    "active" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "ConfigurationVersion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configurationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConfigurationVersion_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "groupKey" TEXT,
    "configurationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Metric_groupKey_fkey" FOREIGN KEY ("groupKey") REFERENCES "Group" ("key") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Metric_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Value" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "metricId" TEXT,
    "defaultToMetricId" TEXT,
    "configurationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Value_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Value_defaultToMetricId_fkey" FOREIGN KEY ("defaultToMetricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Value_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ValueHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valueId" TEXT,
    "weight" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "ValueHistory_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metricId" TEXT,
    "valueId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rule_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rule_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_id_key" ON "Configuration"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigurationVersion_id_key" ON "ConfigurationVersion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigurationVersion_configurationId_key" ON "ConfigurationVersion"("configurationId");

-- CreateIndex
CREATE UNIQUE INDEX "Metric_id_key" ON "Metric"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Value_id_key" ON "Value"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Value_defaultToMetricId_key" ON "Value"("defaultToMetricId");

-- CreateIndex
CREATE UNIQUE INDEX "ValueHistory_id_key" ON "ValueHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_id_key" ON "Group"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_key_key" ON "Group"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_id_key" ON "Rule"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_valueId_key" ON "Rule"("valueId");
