/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "DietaryRestrictionInfo" (
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

    CONSTRAINT "DietaryRestrictionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionInfo" (
    "id" TEXT NOT NULL,
    "servingSize" TEXT,
    "servingUnit" TEXT,
    "calories" TEXT,
    "caloriesFromFat" TEXT,
    "totalFat" TEXT,
    "transFat" TEXT,
    "cholesterol" TEXT,
    "sodum" TEXT,
    "totalCarbohydrates" TEXT,
    "dietaryFiber" TEXT,
    "sugars" TEXT,
    "protein" TEXT,
    "vitaminA" TEXT,
    "vitaminC" TEXT,
    "calcium" TEXT,
    "iron" TEXT,
    "saturatedFat" TEXT,
    "dishId" TEXT NOT NULL,

    CONSTRAINT "NutritionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuPeriod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "MenuPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DietaryRestrictionInfo_dishId_key" ON "DietaryRestrictionInfo"("dishId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionInfo_dishId_key" ON "NutritionInfo"("dishId");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_stationId_key" ON "Restaurant"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_menuId_key" ON "Restaurant"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuPeriod_menuId_key" ON "MenuPeriod"("menuId");

-- AddForeignKey
ALTER TABLE "DietaryRestrictionInfo" ADD CONSTRAINT "DietaryRestrictionInfo_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionInfo" ADD CONSTRAINT "NutritionInfo_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPeriod" ADD CONSTRAINT "MenuPeriod_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
