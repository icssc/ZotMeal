"use client"; 

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "./tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { DiningHallStatus } from "./status";
import DishesInfo from "./dishes-info";
import { HallEnum, HallStatusEnum, mealTimeToEnum } from "@/utils/types";

export default function Side({hall} : {hall : HallEnum}) {
    // TODO: Determine status dynamically based on open/close times and current time
    const currentStatus = HallStatusEnum.OPEN;

    let heroImageSrc, heroImageAlt, mealTimes, openTime, closeTime, stations;

    switch (hall) {
      case HallEnum.ANTEATERY:
        heroImageSrc = "/anteatery.webp";
        heroImageAlt = "An image of the front of the Anteatery dining hall at UCI.";
        mealTimes = ["Breakfast", "Lunch", "Dinner", "Latenight"];
        openTime = "8:00a";
        closeTime = "8:00p";
        stations = ["Home", "Fire & Ice", "Noodle Bar", "The Twisted Root", "Sizzle Grill", "The Oven"];
        break;
      case HallEnum.BRANDYWINE:
        heroImageSrc = "/brandywine.webp";
        heroImageAlt = "An image of the front of the Brandywine dining hall at UCI.";
        mealTimes = ["Breakfast", "Lunch", "Dinner", "Latenight"];
        openTime = "8:00a";
        closeTime = "8:00p";
        stations = ["Grubb", "The Crossroads", "The Twisted Root", "Ember", "Hearth", "The Farm Stand"];
        break;
    }

    const [selectedMealTime, setSelectedMealTime] = useState(
      () => (mealTimes[0] || '').toLowerCase()
    );
    const [selectedStation, setSelectedStation] = useState(
      () => (stations[0] || '').toLowerCase()
    );

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
        <div className="p-5 flex flex-col h-full" id="side-content">
          <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-4 w-full">
              {/* Meal Time Select - Controlled Component */}
              <Select
                value={selectedMealTime}
                onValueChange={(value) => setSelectedMealTime(value || '')}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Meal" />
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
              {/* Dining Hall Status */}
              <DiningHallStatus
                status={currentStatus} // Use dynamic status eventually
                openTime={openTime}
                closeTime={closeTime}
              />
            </div>
            {/* Station Tabs - Controlled Component, only render if stations exist */}
            {stations.length > 0 && (
              <Tabs
                value={selectedStation}
                onValueChange={(value) => setSelectedStation(value || '')}
                className="min-h-full w-full" // Ensure Tabs takes full width
              >
                  <TabsList className="flex flex-wrap w-full">
                      {stations.map((station => {
                        return (
                          <TabsTrigger key={station} value={station.toLowerCase()}>
                            {station} 
                          </TabsTrigger>
                        )
                      }))}
                  </TabsList>
              </Tabs>
            )}
          </div>
          <DishesInfo 
            hall={hall} 
            station={selectedStation} 
            mealTime={mealTimeToEnum[selectedMealTime]}
          />
        </div>
      </div>
    )
}