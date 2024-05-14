DO $$ BEGIN
 CREATE TYPE "period" AS ENUM('latenight', 'dinner', 'lunch', 'brunch', 'breakfast');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "diet_restrictions" (
	"dish_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"contains_eggs" boolean,
	"contains_fish" boolean,
	"contains_milk" boolean,
	"contains_peanuts" boolean,
	"contains_sesame" boolean,
	"contains_shellfish" boolean,
	"contains_soy" boolean,
	"contains_tree_nuts" boolean,
	"contains_wheat" boolean,
	"is_gluten_free" boolean,
	"is_halal" boolean,
	"is_kosher" boolean,
	"is_locally_grown" boolean,
	"is_organic" boolean,
	"is_vegan" boolean,
	"is_vegetarian" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dish_menu_station_joint" (
	"dish_id" text NOT NULL,
	"menu_id" text NOT NULL,
	"station_id" text NOT NULL,
	CONSTRAINT "dish_menu_station_joint_dish_id_menu_id_station_id_pk" PRIMARY KEY("dish_id","menu_id","station_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dishes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"title" text NOT NULL,
	"image" text NOT NULL,
	"restaurant_id" text NOT NULL,
	"description" text NOT NULL,
	"date" date NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT "events_title_restaurant_id_date_pk" PRIMARY KEY("title","restaurant_id","date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menus" (
	"id" text PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"restaurantId" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"start" timestamp(3) NOT NULL,
	"end" timestamp(3) NOT NULL,
	"price" text NOT NULL,
	"period" "period" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrition_info" (
	"dish_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"serving_size" text,
	"serving_unit" text,
	"calories" text,
	"calories_from_fat" text,
	"total_fat_g" text,
	"trans_fat_g" text,
	"saturated_fat_g" text,
	"cholesterol_mg" text,
	"sodium_mg" text,
	"total_carbs_g" text,
	"dietary_fiber_g" text,
	"sugars_mg" text,
	"protein_g" text,
	"vitamin_a_iu" text,
	"vitamin_c_iu" text,
	"calcium_mg" text,
	"iron_mg" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "push_token" (
	"token" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT "restaurants_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stations" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"name" text NOT NULL,
	"restaurantId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "diet_restrictions" ADD CONSTRAINT "diet_restrictions_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dish_menu_station_joint" ADD CONSTRAINT "dish_menu_station_joint_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dish_menu_station_joint" ADD CONSTRAINT "dish_menu_station_joint_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dish_menu_station_joint" ADD CONSTRAINT "dish_menu_station_joint_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "stations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nutrition_info" ADD CONSTRAINT "nutrition_info_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stations" ADD CONSTRAINT "stations_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
