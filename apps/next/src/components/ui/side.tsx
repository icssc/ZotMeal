import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "./tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { HallStatusEnum, DiningHallStatus } from "./status";
import DishesInfo from "./dishes-info";

interface SideProps {
  heroImageSrc: string;
  heroImageAlt: string;
  mealTimes: string[];
  openTime: string;
  closeTime: string;
  stations: string[];
}

export default function Side({
  heroImageSrc,
  heroImageAlt,
  mealTimes,
  openTime,
  closeTime,
  stations,
}: SideProps ) {
    return (
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <Image 
          className="object-cover object-bottom w-full min-h-80 max-h-80"
          src={heroImageSrc}
          alt={heroImageAlt}
          width={2000}
          height={2000}
        />
        <div className="p-5 flex flex-col h-full" id="side-content">
          <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-4 w-full">
              <Select defaultValue={mealTimes[0].toLowerCase()}>
                <SelectTrigger className="w-40">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  {mealTimes.map((time) => {
                    return (
                      <SelectItem key={time} value={time.toLowerCase()}>
                        {time}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <DiningHallStatus
                status={HallStatusEnum.OPEN}
                openTime={openTime}
                closeTime={closeTime}
              />
            </div>
            <Tabs defaultValue={stations[0].toLowerCase()} className="min-h-full">
                <TabsList className="flex flex-wrap w-full ">
                    {stations.map((station => {
                      return (
                        <TabsTrigger key={station} value={station.toLowerCase()}>
                          {station}
                        </TabsTrigger>
                      )
                    }))}
                </TabsList>
            </Tabs>
          </div>
          <DishesInfo hall={"ae"} station={"grubb"}/>
        </div>
      </div>
    )
}