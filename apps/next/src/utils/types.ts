import { toTitleCase } from "./funcs"; 

enum StatusColors {
    OPEN = "bg-emerald-500",
    CLOSED = "bg-red-500",
    ERROR = "bg-amber-500"
};

enum HallStatusEnum {
    OPEN,
    CLOSED,
    ERROR
};

enum HallEnum {
    ANTEATERY,
    BRANDYWINE
};

enum MealTimeEnum {
    BREAKFAST,
    LUNCH,
    DINNER,
    LATENIGHT
}


const nutrientToUnit : { [nutrient: string]: string } = {
  "calories": "cal",
  "totalFatG": "g",
  "transFatG": "g",
  "saturatedFatG": "g",
  "cholesterolMg": "mg",
  "sodiumMg": "mg",
  "totalCarbsG": "g",
  "dietaryFiberG": "g",
  "sugarsMg": "mg",
  "proteinG": "g",
  "vitaminAIU": "% DV",
  "vitaminCIU": "% DV",
  "calciumMg": "mg",
  "ironMg": "mg",
}

const numToMonth : {[num: number]: string} = {
  0:  "Jan.",
  1:  "Feb.",
  2:  "Mar.",
  3:  "Apr.",
  4:  "May",
  5:  "Jun.",
  6:  "Jul.",
  7:  "Aug.",
  8:  "Sep.",
  9:  "Oct.",
  10: "Nov.",
  11: "Dec."
};


export { StatusColors, 
         HallStatusEnum, 
         HallEnum, 
         MealTimeEnum, 
         nutrientToUnit,
         numToMonth
};