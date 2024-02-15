-- CreateEnum
CREATE TYPE "MenuPeriod" AS ENUM ('breakfast', 'brunch', 'lunch', 'dinner', 'latenight');

-- CreateEnum
CREATE TYPE "RestaurantName" AS ENUM ('brandywine', 'anteatery');

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" "RestaurantName" NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "period" "MenuPeriod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Event" (
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("title","link","date")
);

-- CreateIndex
CREATE UNIQUE INDEX "DietRestriction_dishId_key" ON "DietRestriction"("dishId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionInfo_dishId_key" ON "NutritionInfo"("dishId");

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietRestriction" ADD CONSTRAINT "DietRestriction_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionInfo" ADD CONSTRAINT "NutritionInfo_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
