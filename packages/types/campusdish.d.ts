import type { LocationNames } from "../api/src/utils/constants";

export interface CampusDishResponse {
  LocationId: keyof typeof LocationNames;
  Menu: Menu;
}

export interface Menu {
  MenuStations: MenuStation[];
  MenuProducts: MenuProduct[];
}

export interface MenuProduct {
  StationId: MenuStation['StationId'];
  Product: Product;
}

export interface Product {
  ProductId: string;
  MarketingName: string;
  ShortDescription: string;
  ContainsEggs: boolean;
  ContainsFish: boolean;
  ContainsMilk: boolean;
  ContainsPeanuts: boolean;
  ContainsShellfish: boolean;
  ContainsSoy: boolean;
  ContainsTreeNuts: boolean;
  ContainsWheat: boolean;
  ContainsSesame: boolean;
  IsGlutenFree: boolean;
  IsHalal: boolean;
  IsKosher: boolean;
  IsLocallyGrown: boolean;
  IsOrganic: boolean;
  IsVegan: boolean;
  IsVegetarian: boolean;
}

export interface MenuStation {
  StationId: string;
  Name: string;
}