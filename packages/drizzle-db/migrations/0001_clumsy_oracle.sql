DROP TABLE "_MenuToStation";--> statement-breakpoint
ALTER TABLE "Station" ADD COLUMN "menuId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Station" ADD CONSTRAINT "Station_menuId_Menu_id_fk" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
