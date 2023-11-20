/*
  Warnings:

  - Added the required column `type` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" INTEGER NOT NULL,
    "metricId" TEXT,
    "valueId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rule_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rule_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Rule" ("createdAt", "id", "metricId", "updatedAt", "valueId") SELECT "createdAt", "id", "metricId", "updatedAt", "valueId" FROM "Rule";
DROP TABLE "Rule";
ALTER TABLE "new_Rule" RENAME TO "Rule";
CREATE UNIQUE INDEX "Rule_id_key" ON "Rule"("id");
CREATE UNIQUE INDEX "Rule_valueId_key" ON "Rule"("valueId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
