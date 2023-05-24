export type Nutrition = {
    calcium: number
    calories: number
    caloriesFromFat: number
    cholesterol: number
    dietaryFiber: number
    iron: number
    isEatWell: boolean
    isPlantForward: boolean
    isVegan: boolean
    isVegetarian: boolean
    isWholeGrain: boolean
    protein: number
    saturatedFat: number
    servingSize: number
    servingUnit: string
    sodium: number
    sugars: number
    totalCarbohydrates: number
    totalFat: number
    transFat: number
    vitaminC: number
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
    price: {[key: string]: number}
    schedule: {[key: string]: {start: number, end: number}}
}