-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
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
CREATE TABLE IF NOT EXISTS "Restaurant" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" "RestaurantName" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MenuPeriod" (
	"id" text PRIMARY KEY NOT NULL,
	"name" "MenuPeriodName" NOT NULL,
	"start" timestamp(3) NOT NULL,
	"end" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Menu" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"periodId" text NOT NULL,
	"date" timestamp(3) NOT NULL,
	"restaurantId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DietRestriction" (
	"dishId" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"containsFish" boolean,
	"containsMilk" boolean,
	"containsPeanuts" boolean,
	"containsSesame" boolean,
	"containsShellfish" boolean,
	"containSoy" boolean,
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
CREATE TABLE IF NOT EXISTS "NutritionInfo" (
	"dishId" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"servingSize" text,
	"servingUnit" text,
	"calories" text,
	"caloriesFromFat" text,
	"totalFat" text,
	"transFat" text,
	"cholesterol" text,
	"sodum" text,
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
CREATE TABLE IF NOT EXISTS "_MenuToStation" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PushToken" (
	"token" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Station" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"restaurantId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Dish" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"stationId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"title" text NOT NULL,
	"link" text NOT NULL,
	"description" text NOT NULL,
	"date" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Event_pkey" PRIMARY KEY("title","link","date")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Restaurant_name_key" ON "Restaurant" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "MenuPeriod_name_key" ON "MenuPeriod" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_MenuToStation_AB_unique" ON "_MenuToStation" ("A","B");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_MenuToStation_B_index" ON "_MenuToStation" ("B");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Menu" ADD CONSTRAINT "Menu_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "public"."MenuPeriod"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DietRestriction" ADD CONSTRAINT "DietRestriction_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "public"."Dish"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "NutritionInfo" ADD CONSTRAINT "NutritionInfo_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "public"."Dish"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_MenuToStation" ADD CONSTRAINT "_MenuToStation_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Menu"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_MenuToStation" ADD CONSTRAINT "_MenuToStation_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Station"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Station" ADD CONSTRAINT "Station_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Dish" ADD CONSTRAINT "Dish_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/
