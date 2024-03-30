DO $$ BEGIN
 CREATE TYPE "MenuPeriodName" AS ENUM('latenight', 'dinner', 'lunch', 'brunch', 'breakfast');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "RestaurantName" AS ENUM('anteatery', 'brandywine');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DietRestriction" (
	"dishId" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"containsEggs" boolean,
	"containsFish" boolean,
	"containsMilk" boolean,
	"containsPeanuts" boolean,
	"containsSesame" boolean,
	"containsShellfish" boolean,
	"containsSoy" boolean,
	"containsTreeNuts" boolean,
	"containsWheat" boolean,
	"isGlutenFree" boolean,
	"isHalal" boolean,
	"isKosher" boolean,
	"isLocallyGrown" boolean,
	"isOrganic" boolean,
	"isVegan" boolean,
	"isVegetarian" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Dish" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"stationId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"title" text NOT NULL,
	"image" text NOT NULL,
	"restaurant" "RestaurantName" NOT NULL,
	"description" text NOT NULL,
	"date" date NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "Event_pkey" PRIMARY KEY("title","date","restaurant")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Menu" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"periodId" text NOT NULL,
	"date" timestamp(3) NOT NULL,
	"restaurantId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MenuPeriod" (
	"id" text PRIMARY KEY NOT NULL,
	"name" "MenuPeriodName" NOT NULL,
	"start" timestamp(3) NOT NULL,
	"end" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Restaurant" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"name" "RestaurantName" NOT NULL,
	CONSTRAINT "Restaurant_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Station" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"restaurantId" text NOT NULL,
	"menuId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PushToken" (
	"token" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NutritionInfo" (
	"dishId" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"servingSize" text,
	"servingUnit" text,
	"calories" text,
	"caloriesFromFat" text,
	"totalFat" text,
	"transFat" text,
	"cholesterol" text,
	"sodium" text,
	"totalCarbohydrates" text,
	"dietaryFiber" text,
	"sugars" text,
	"protein" text,
	"vitaminA" text,
	"vitaminC" text,
	"calcium" text,
	"iron" text,
	"saturatedFat" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "MenuPeriod_name_key" ON "MenuPeriod" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Restaurant_name_key" ON "Restaurant" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DietRestriction" ADD CONSTRAINT "DietRestriction_dishId_Dish_id_fk" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Dish" ADD CONSTRAINT "Dish_stationId_Station_id_fk" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Menu" ADD CONSTRAINT "Menu_periodId_MenuPeriod_id_fk" FOREIGN KEY ("periodId") REFERENCES "MenuPeriod"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_Restaurant_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Station" ADD CONSTRAINT "Station_restaurantId_Restaurant_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Station" ADD CONSTRAINT "Station_menuId_Menu_id_fk" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NutritionInfo" ADD CONSTRAINT "NutritionInfo_dishId_Dish_id_fk" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
