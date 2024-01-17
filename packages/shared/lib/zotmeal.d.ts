export type Nutrition = {
    calcium: string
    calories: string
    caloriesFromFat: string
    cholesterol: string
    dietaryFiber: string
    iron: string
    isEatWell: boolean
    isPlantForward: boolean
    isVegan: boolean
    isVegetarian: boolean
    isWholeGrain: boolean
    protein: string
    saturatedFat: string
    servingSize: string
    servingUnit: string
    sodium: string
    sugars: string
    totalCarbohydrates: string
    totalFat: string
    transFat: string
    vitaminC: string
}

export type ItemInfo = {
    description: string
    name: string
    nutrition: Nutrition
}

export type MenuInfo = {
    category: string
    items: ItemInfo[]
}

export type StationInfo = {
    menu: MenuInfo[]
    station: string
}

export type LocationInfo = {
    all: StationInfo[]
    currentMeal: string
    date: string
    restaurant: string
    price: { [key: string]: number }
    schedule: { [key: string]: { start: number, end: number } }
}