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

export type Item = {
    description: string
    name: string
    nutrition: Nutrition
}

export type Menu = {
    category: string
    items: Item[]
}

export type Station = {
    menu: Menu[]
    station: string
}

export type LocationInfo = {
    all: Station[]
    currentMeal: string
    date: string
    restaurant: string
}