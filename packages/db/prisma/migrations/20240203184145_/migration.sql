/*
  Warnings:

  - You are about to drop the column `menuId` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `stationId` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the `DietaryRestrictionInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuPeriod` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `end` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `Station` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MenuPeriod" AS ENUM ('BREAKFAST', 'BRUNCH', 'LUNCH', 'DINNER', 'LATENIGHT');

-- DropForeignKey
ALTER TABLE "DietaryRestrictionInfo" DROP CONSTRAINT "DietaryRestrictionInfo_dishId_fkey";

-- DropForeignKey
ALTER TABLE "MenuPeriod" DROP CONSTRAINT "MenuPeriod_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_stationId_fkey";

-- DropIndex
DROP INDEX "Restaurant_menuId_key";

-- DropIndex
DROP INDEX "Restaurant_stationId_key";

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "period" "MenuPeriod" NOT NULL,
ADD COLUMN     "restaurantId" TEXT NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "menuId",
DROP COLUMN "stationId";

-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "DietaryRestrictionInfo";

-- DropTable
DROP TABLE "MenuPeriod";

-- CreateTable
CREATE TABLE "DietRestriction" (
    "id" TEXT NOT NULL,
    "containsFish" BOOLEAN,
    "containsMilk" BOOLEAN,
    "containsPeanuts" BOOLEAN,
    "containsSesame" BOOLEAN,
    "containsShellfish" BOOLEAN,
    "containSoy" BOOLEAN,
    "containsTreeNuts" BOOLEAN,
    "containsWheat" BOOLEAN,
    "isGlutenFree" BOOLEAN,
    "isHalal" BOOLEAN,
    "isKosher" BOOLEAN,
    "isLocallyGrown" BOOLEAN,
    "isOrganic" BOOLEAN,
    "isVegan" BOOLEAN,
    "isVegetarian" BOOLEAN,
    "dishId" TEXT NOT NULL,

    CONSTRAINT "DietRestriction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DietRestriction_dishId_key" ON "DietRestriction"("dishId");

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietRestriction" ADD CONSTRAINT "DietRestriction_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
