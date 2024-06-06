import { format } from "date-fns";

import type { MenuWithRelations } from "@zotmeal/db";

const metadataFields = {
  createdAt: new Date(),
  updatedAt: new Date(),
};

const dietRestriction = {
  containsEggs: false,
  containsFish: false,
  containsPeanuts: false,
  containsMilk: false,
  containsShellfish: false,
  containsSesame: false,
  containsSoy: false,
  containsTreeNuts: false,
  containsWheat: false,
  isGlutenFree: false,
  isHalal: false,
  isKosher: false,
  isLocallyGrown: false,
  isOrganic: false,
  isVegan: false,
  isVegetarian: false,
} satisfies Partial<
  MenuWithRelations["stations"][0]["dishes"][0]["dietRestriction"]
>;

const nutritionInfo = {
  servingSize: "1",
  calories: "300",
  dietaryFiberG: "2",
  proteinG: "1",
  sugarsMg: "5",
  totalCarbsG: "30",
  totalFatG: "15",
  transFatG: "0",
  saturatedFatG: "5",
  sodiumMg: "300",
  cholesterolMg: "50",
  vitaminAIU: "22.22",
  vitaminCIU: "33.33",
  calciumMg: "111.22",
  ironMg: "3.01",
  servingUnit: "g",
  caloriesFromFat: "2",
} satisfies Partial<
  MenuWithRelations["stations"][0]["dishes"][0]["nutritionInfo"]
>;

const restaurantId = "3314";

const times = {
  start: new Date(),
  end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
};

const date = format(new Date(), "yyyy-MM-dd");

// TODO: Replace with real data
export const brandywineData = {
  ...metadataFields,
  date,
  id: "123",
  price: "10.00",

  restaurantId,
  ...times,
  period: "breakfast",
  stations: [
    {
      id: "111",
      name: "Honeycakes/Bakery",
      ...metadataFields,
      restaurantId,
      dishes: [
        {
          name: "Blueberry Scone",
          id: "123",
          ...metadataFields,
          category: "Bakery",
          description: "A delicious blueberry scone",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Breakfast Muffin",
          id: "312",
          ...metadataFields,
          category: "Bakery",
          description: "A delicious breakfast muffin",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 1",
          id: "444",
          ...metadataFields,
          category: "Sides",
          description: "A delicious side dish",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 2",
          id: "555",
          ...metadataFields,
          category: "Sides",
          description: "A delicious side dish 2",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
      ],
    },
    {
      id: "222",
      name: "Hearth/Pizza",
      ...metadataFields,
      restaurantId,
      dishes: [
        {
          name: "Blueberry Scone",
          id: "123",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Breakfast Muffin",
          id: "312",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 1",
          id: "444",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 2",
          id: "555",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
      ],
    },
    {
      id: "222",
      name: "Hearth/Pizza 2",
      ...metadataFields,
      restaurantId,
      dishes: [
        {
          name: "Blueberry Scone",
          id: "123",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Breakfast Muffin",
          id: "312",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 1",
          id: "444",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 2",
          id: "555",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
      ],
    },
    {
      id: "222",
      name: "Hearth/Pizza 3",
      ...metadataFields,
      restaurantId,
      dishes: [
        {
          name: "Blueberry Scone",
          id: "123",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Breakfast Muffin",
          id: "312",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 1",
          id: "444",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 2",
          id: "555",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
      ],
    },
  ],
} satisfies MenuWithRelations;

// TODO: Replace with real data
export const anteateryData = {
  date,
  id: "5555",
  price: "10.00",
  ...metadataFields,
  restaurantId: "3056",
  ...times,
  period: "breakfast",
  stations: [
    {
      id: "111",
      name: "Honeycakes/Bakery",
      ...metadataFields,
      restaurantId: "3056",
      dishes: [
        {
          name: "Blueberry Scone",
          id: "123",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Breakfast Muffin",
          id: "312",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 1",
          id: "444",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 2",
          id: "555",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
      ],
    },
    {
      id: "222",
      name: "Hearth/Pizza",
      ...metadataFields,
      restaurantId: "3056",
      dishes: [
        {
          name: "Pizza",
          id: "9122",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Breakfast Muffin",
          id: "312",
          ...metadataFields,
          category: "Bakery",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 1",
          id: "444",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
        {
          name: "Side 2",
          id: "555",
          ...metadataFields,
          category: "Sides",
          description: "Item Description",
          dietRestriction: {
            dishId: "123",
            ...metadataFields,
            ...dietRestriction,
          },
          nutritionInfo: {
            ...metadataFields,
            dishId: "123",
            ...nutritionInfo,
          },
          menuId: "",
          stationId: "",
        },
      ],
    },
  ],
} satisfies MenuWithRelations;
