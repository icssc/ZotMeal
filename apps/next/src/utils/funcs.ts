import { RestaurantInfo } from "@zotmeal/api";

function getStationsFromData(data : RestaurantInfo): string[] {
  let stations: string[] = [];

  data.menus.forEach(menu => {
    menu.stations.forEach(station => {
      stations.push(station.name);
    })
  })

  return stations;
}

export { getStationsFromData };