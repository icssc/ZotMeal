import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from "./dialog";
import Image from "next/image";

interface FoodCardProps {
  title: string;
  calories: number;
  imgSrc: string;
  alt: string;
  rating: number;
  numRatings: number;
}

export default function FoodDialogContent({
  title,
  calories,
  imgSrc,
  alt,
  rating,
  numRatings
}: FoodCardProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <Image
          src={imgSrc}
          alt={alt}
          width={20}
          height={20}
        />
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>     
    </DialogContent>
  )
}