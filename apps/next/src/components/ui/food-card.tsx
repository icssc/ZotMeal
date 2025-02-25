import { Dialog, DialogContent, DialogTrigger } from "./dialog"
import FoodCardContent from "./food-card-content";
import FoodDialogContent from "./food-dialog-content"

interface FoodCardProps {
  title: string;
  calories: number;
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