"use client"; 

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "./shadcn/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shadcn/select";
import { DiningHallStatus } from "./status";
import DishesInfo from "./dishes-info";
import { HallEnum, HallStatusEnum, MealTimeEnum} from "@/utils/types";
import { trpc } from "@/utils/trpc"; // Import tRPC hook
import { RestaurantInfo } from "@zotmeal/api"; // Import types
import { toTitleCase, utcToPacificTime, formatOpenCloseTime } from "@/utils/funcs";
import TabsSkeleton from "./skeleton/tabs-skeleton";
import SelectSkeleton from "./skeleton/select-skeleton";

export default function Side({hall} : {hall : HallEnum}) {

    // Fetch data using tRPC
    const [queryDate] = useState(() => new Date());
    const { data: queryResponse, isLoading, isError, error } = trpc.zotmeal.useQuery(
      {date: queryDate},
      {staleTime: 2 * 60 * 60 * 1000} // 2 hour stale time
    );

    let heroImageSrc: string | undefined, heroImageAlt: string | undefined;
    let openTime: Date | undefined, closeTime: Date | undefined;
    // TODO: Fetch meal times dynamically without relying upon enum and sort
    const mealTimes = Object.keys(MealTimeEnum).filter(k => isNaN(Number(k))); 

    switch (hall) {
      case HallEnum.ANTEATERY:
        heroImageSrc = "/anteatery.webp";
        heroImageAlt = "An image of the front of the Anteatery dining hall at UCI.";
        break;
      case HallEnum.BRANDYWINE:
        heroImageSrc = "/brandywine.webp";
        heroImageAlt = "An image of the front of the Brandywine dining hall at UCI.";
        break;
    }

    // State for user selections
    const [selectedMealTime, setSelectedMealTime] = useState(
      () => (mealTimes[0] || '').toLowerCase()
    );
    const [selectedStation, setSelectedStation] = useState<string>(''); // Start empty

    // --- Derived Data ---
    const hallData: RestaurantInfo | undefined = !isLoading && !isError && queryResponse
      ? (hall === HallEnum.ANTEATERY ? queryResponse.anteatery : queryResponse.brandywine)
      : undefined;

    //TODO: Grey-out the menus that have no stations
    const currentMenu = hallData?.menus.find(menu =>
      menu.period.name.toLowerCase() === selectedMealTime.toLowerCase()
    );

    const fetchedStations = currentMenu?.stations ?? [];

    const currentStation = fetchedStations.find(stationEntry =>
      stationEntry.name.toLowerCase() === selectedStation.toLowerCase()
    );

    const dishesForSelectedStation = currentStation?.dishes ?? [];

    let availablePeriodTimes: { [mealName: string]: [Date, Date]} = {};
    let derivedHallStatus: HallStatusEnum = HallStatusEnum.CLOSED; // Default status

    if (!isLoading && !isError && hallData?.menus && hallData.menus.length > 0) {
      let earliestOpen: Date | null = null;
      let latestClose: Date | null = null;

      hallData.menus.forEach(menu => {
        try {
          const periodNameLower = menu.period.name.toLowerCase();
          const currentPeriodOpenTime = utcToPacificTime(menu.period.startTime);
          const currentPeriodCloseTime = utcToPacificTime(menu.period.endTime);

          if (periodNameLower === 'latenight') {
            currentPeriodOpenTime.setDate(currentPeriodOpenTime.getDate() + 1);
            currentPeriodCloseTime.setDate(currentPeriodCloseTime.getDate() + 1);
          }

          availablePeriodTimes[periodNameLower] = [currentPeriodOpenTime, currentPeriodCloseTime];

          if (!earliestOpen || currentPeriodOpenTime < earliestOpen) {
            earliestOpen = currentPeriodOpenTime;
          }
          if (!latestClose || currentPeriodCloseTime > latestClose) {
            latestClose = currentPeriodCloseTime;
          }
        } catch (e) {
          console.error("Error parsing time:", e);
        }
      });

      openTime = earliestOpen ?? undefined;
      closeTime = latestClose ?? undefined;

      if (openTime === undefined &&  closeTime === undefined)
        derivedHallStatus = HallStatusEnum.ERROR;
      else if (queryDate >= openTime! && queryDate < closeTime!)
        derivedHallStatus = HallStatusEnum.OPEN;
      else 
        derivedHallStatus = HallStatusEnum.CLOSED;
    }
    // --- End Derived Data ---


    // Effect to update selected station when stations change 
    // (e.g., mealtime change or data load)
    useEffect(() => {
      if (fetchedStations.length > 0) {
        const firstStationNameLower = fetchedStations[0].name.toLowerCase();
        // Check if current selection is valid, if not, reset to first
        const currentSelectionIsValid = fetchedStations.some(s => s.name.toLowerCase() === selectedStation);
        if (!currentSelectionIsValid || !selectedStation) {
           setSelectedStation(firstStationNameLower);
        }
      } else {
        setSelectedStation('');
      }
      // Dependency array: Run when the list of stations changes or the hall changes
      // Note: Adding selectedStation here would cause infinite loop if resetting.
      // We only want to reset based on the *availability* of stations.
    }, [fetchedStations, hall]); // Re-run when dynamicStations array identity changes

    return (
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <Image 
          className="object-cover object-bottom w-full min-h-80 max-h-80"
          src={heroImageSrc}
          alt={heroImageAlt}
          width={2000}
          height={2000}
          priority 
        />
        <div className="p-5 flex flex-col flex-grow h-1" id="side-content"> 
          <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-4 w-full">
              {isLoading && <SelectSkeleton/>}
              {!isLoading && !isError && <Select
                value={selectedMealTime}
                onValueChange={(value) => setSelectedMealTime(value || '')}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select Meal" />
                </SelectTrigger>
                <SelectContent>
                  {mealTimes.map((time) => {
                    const mealTimeKey = time.toLowerCase();
                    const periodTimes = availablePeriodTimes[mealTimeKey]; 

                    return (
                      <SelectItem key={time} value={mealTimeKey}>
                        {toTitleCase(time)}&nbsp;
                        {periodTimes && (
                          <span className="text-zinc-500 text-sm">
                            &nbsp;({formatOpenCloseTime(periodTimes[0], periodTimes[1])})
                          </span>
                        )}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>}
              {!isLoading && !isError && openTime && closeTime && // Ensure openTime and closeTime are defined
              <DiningHallStatus
                status={derivedHallStatus}
                openTime={openTime.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                closeTime={closeTime.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
              />}
            </div>
            {!isLoading && !isError && fetchedStations.length > 0 && (
              <Tabs
                value={selectedStation}
                onValueChange={(value) => setSelectedStation(value || '')}
                className="w-full" 
              >
                  <TabsList className="flex flex-wrap w-full">
                      {fetchedStations.map((station => {
                        return (
                          <TabsTrigger key={station.name} value={station.name.toLowerCase()}>
                            {toTitleCase(station.name)}
                          </TabsTrigger>
                        )
                      }))}
                  </TabsList>
              </Tabs>
            )}
            {isLoading && <TabsSkeleton/> /* Tab Skeleton */}
            {!isLoading && !isError && fetchedStations.length === 0 && (
                 <p className="text-center text-gray-500 py-2">No stations found for {toTitleCase(selectedMealTime)}.</p>
            )}
          </div>

          <DishesInfo 
            dishes={dishesForSelectedStation}
            isLoading={isLoading}
            isError={isError || (!isLoading && !hallData)} 
            errorMessage={error?.message ?? (!isLoading && !hallData ? `Data not available for ${HallEnum[hall]}.` : undefined)}
          />
        </div>
      </div>
    )
}