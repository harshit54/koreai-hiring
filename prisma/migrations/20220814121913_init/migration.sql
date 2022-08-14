/*
  Warnings:

  - You are about to drop the `Capacity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Capacity";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "milkCapacity" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_date_key" ON "Stock"("date");
