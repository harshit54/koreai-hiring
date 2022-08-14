/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Capacity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Capacity_date_key" ON "Capacity"("date");
