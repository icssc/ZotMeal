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
import { toTitleCase, utcToPacificTime, formatOpenCloseTime, isSameDay } from "@/utils/funcs";
import TabsSkeleton from "./skeleton/tabs-skeleton";
import SelectSkeleton from "./skeleton/select-skeleton";
import { useDate } from "@/context/DateContext";


export default function Side({hall, isMobile = false} : {hall: HallEnum, isMobile: boolean}) {
    const { selectedDate } = useDate();
    const today = new Date();

    // Fetch data using tRPC
    const { data: queryResponse, isLoading, isError, error } = trpc.zotmeal.useQuery(
      {date: selectedDate!},
      {staleTime: 2 * 60 * 60 * 1000} // 2 hour stale time
    );

    let heroImageSrc: string | undefined, heroImageAlt: string | undefined;
    let openTime: Date | undefined, closeTime: Date | undefined;
    let periods: string[] | null = [];

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


    // --- Derived Data ---
    const hallData: RestaurantInfo | undefined = !isLoading && !isError && queryResponse
      ? (hall === HallEnum.ANTEATERY ? queryResponse.anteatery : queryResponse.brandywine)
      : undefined;

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
          } else if (selectedDate?.getDay() == today.getDay() && selectedDate.getMonth() == today.getMonth() && selectedDate.getFullYear() == today.getFullYear()) {
            currentPeriodOpenTime.setDate(today.getDate())
            currentPeriodCloseTime.setDate(today.getDate())
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

      if (openTime === undefined && closeTime === undefined)
        derivedHallStatus = HallStatusEnum.ERROR;
      else if (today.getDay() != openTime!.getDay())
        derivedHallStatus = HallStatusEnum.PREVIEW
      else if (selectedDate! >= openTime! && selectedDate! < closeTime!)
        derivedHallStatus = HallStatusEnum.OPEN;
      else 
        derivedHallStatus = HallStatusEnum.CLOSED;
    }
    // --- End Derived Data ---

    // Sorts the period keys by time (earliest to latest)
    periods = Object.keys(availablePeriodTimes).sort((a, b) => {
      let aOpenTime: Date = availablePeriodTimes[a][0]
      let bOpenTime: Date = availablePeriodTimes[b][0]

      if (aOpenTime <= bOpenTime)
        return -1
      else 
        return 1
    });

    const [selectedPeriod, setSelectedPeriod] = useState<string>('');
    const [selectedStation, setSelectedStation] = useState<string>('');

    // Effect to update selectedPeriod when periods data changes
    useEffect(() => {
      // Ensure selectedDate is defined and periods are available
      if (selectedDate && periods.length > 0 && Object.keys(availablePeriodTimes).length > 0) {
        const currentPeriodIsValid = periods.some(p => p.toLowerCase() === selectedPeriod.toLowerCase());
        if (!isSameDay(selectedDate, today))
          setSelectedPeriod(periods[0])
        else if (!currentPeriodIsValid) {
          setSelectedPeriod(getCurrentPeriod(selectedDate, availablePeriodTimes));
        }
      } else {
        setSelectedPeriod('');
      }
    }, [periods]); // Rerun when the `periods` array identity changes.


    //TODO: Grey-out the menus that have no stations
    const currentMenu = hallData?.menus.find(menu =>
      menu.period.name.toLowerCase() === selectedPeriod.toLowerCase()
    );

    const fetchedStations: RestaurantInfo['menus'][number]['stations'] 
    = currentMenu?.stations ?? [];

    const currentStation = fetchedStations.find(stationEntry =>
      stationEntry.name.toLowerCase() === selectedStation.toLowerCase()
    );

    const dishesForSelectedStation = currentStation?.dishes ?? [];


    // Effect to update selected station when stations change 
    useEffect(() => {
      if (fetchedStations.length > 0) {
        // Ensure fetchedStations[0] and its name property exist before accessing
        const firstStationNameLower = fetchedStations[0].name.toLowerCase();
        // Check if current selection is valid, if not, reset to first
        const currentSelectionIsValid = fetchedStations.some(s => s.name.toLowerCase() === selectedStation);
        if (!currentSelectionIsValid || !selectedStation) {
            setSelectedStation(firstStationNameLower);
        }
      } else {
        setSelectedStation('');
      }
      // Note: Adding selectedStation here would cause infinite loop if resetting.
      // We only want to reset based on the *availability* of stations.
    }, [fetchedStations, hall]); // Re-run when fetchedStations array identity changes

    return (
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <Image 
          className="object-cover object-bottom w-full min-h-[20vh] max-h-[30vh] h-2/5"
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
                value={selectedPeriod}
                onValueChange={(value) => setSelectedPeriod(value || '')}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select Meal" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((time) => {
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
            {!isLoading && !isError && fetchedStations.length === 0 && selectedPeriod && (
                 <p className="text-center text-gray-500 py-2">No stations found for {toTitleCase(selectedPeriod)}.</p>
            )}
            {!isLoading && !isError && fetchedStations.length === 0 && !selectedPeriod && (
                 <p className="text-center text-gray-500 py-2">No stations found.</p>
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

function getCurrentPeriod(selectedDate: Date, periods: { [periodName: string]: [Date, Date] }): string {
  for (let key in periods) {
    let periodBegin: Date = periods[key][0];
    let periodEnd: Date = periods[key][1];

    if (selectedDate >= periodBegin && selectedDate <= periodEnd)
      return key;

  }

  return Object.keys(periods)[0];
}
