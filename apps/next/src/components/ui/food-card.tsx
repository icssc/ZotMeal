import { Dialog, DialogTrigger } from "./dialog"
import FoodCardContent from "./food-card-content";
import FoodDialogContent from "./food-dialog-content"

export interface NutritionInfo {
  calories: number;
  totalFat: number;
  transFat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  carbs: number;
  fiber: number;
  sugar: number;
  protein: number;
  vitaminA: number;
  vitaminC: number;
  calcium: number;
  iron: number;
}

export interface DiningHallInfo {
  hall: string;
  station: string;
}

export interface FoodCardProps {
  title: string;
  description: string;
  info: NutritionInfo;
  hallInfo: DiningHallInfo;
  imgSrc: string;
  alt: string;
  rating: number;
  numRatings: number;
}


export default function FoodCard( props : FoodCardProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FoodCardContent {... props}/>
        </DialogTrigger>
        <FoodDialogContent {... props}/>
      </Dialog>
    )
}