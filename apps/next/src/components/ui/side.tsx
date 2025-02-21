import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "./tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { HallStatusEnum, DiningHallStatus } from "./status";
import FoodCard from "./food-card";
import MealDivider from "./meal-divider";

export default function Side() {
    return (
      <div className="z-0">
        <Image 
          className="object-cover object-bottom w-full max-h-80"
          src="/brandywine.webp"
          alt="An image of brandywine"
          width={2000}
          height={2000}
        />
        <div className="p-5">
          <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-4 w-full">
              <Select defaultValue="breakfast">
                <SelectTrigger className="w-40">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="latenite">Latenite</SelectItem>
                </SelectContent>
              </Select>
              <DiningHallStatus
                status={HallStatusEnum.OPEN}
                openTime="8:00a"
                closeTime="8:00p"
              />
            </div>
            <Tabs defaultValue="grubb" className="w-full">
                <TabsList className="flex w-full">
                    <TabsTrigger value="grubb">Grubb</TabsTrigger>
                    <TabsTrigger value="crossroads">The Crossroads</TabsTrigger>
                    <TabsTrigger value="twisted-root">The Twisted Root</TabsTrigger>
                    <TabsTrigger value="ember">Ember</TabsTrigger>
                    <TabsTrigger value="hearth">Hearth</TabsTrigger>
                    <TabsTrigger value="farm-stand">The Farm Stand</TabsTrigger>
                </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-6 mt-10">
            <MealDivider title="Entree"/>
            <FoodCard
              title="Meal"
              calories={121}
              imgSrc="/ZotMeal-Logo.webp"
              alt="Image of meal"
              rating={4.7}
              numRatings={8558}
            />
            <FoodCard
              title="Meal"
              calories={121}
              imgSrc="/ZotMeal-Logo.webp"
              alt="Image of meal"
              rating={4.7}
              numRatings={8558}
            />
            <MealDivider title="Sides"/>
            <FoodCard
              title="Meal"
              calories={121}
              imgSrc="/ZotMeal-Logo.webp"
              alt="Image of meal"
              rating={4.7}
              numRatings={8558}
            />
            <FoodCard
              title="Meal"
              calories={121}
              imgSrc="/ZotMeal-Logo.webp"
              alt="Image of meal"
              rating={4.7}
              numRatings={8558}
            />
          </div>
        </div>
      </div>
    )
}