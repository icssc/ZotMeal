import Image from "next/image"
import { Card, CardContent} from "./card"
import { Star } from "lucide-react"

interface FoodCardProps {
  title: string;
  calories: number;
  imgSrc: string;
  alt: string;
  rating: number;
  numRatings: number;
}


export default function FoodCard({ 
  title, 
  calories, 
  imgSrc, 
  alt, 
  rating, 
  numRatings
} : FoodCardProps) {
    return (
      <Card>
        <CardContent>
          <div className="flex justify-between h-full pt-6">
            <div className="flex items-center gap-6">
              <Image 
                src={imgSrc}
                alt={alt}
                width={84}
                height={84}
                className="rounded-sm"
              />
              <div className="flex flex-col h-full">
                <strong>{title}</strong>
                  <div className="flex gap-2 items-center">
                    <span>{calories} cal</span>
                      <div className="flex gap-1 items-center">
                        <Star className="w-4 stroke-slate-400 stroke-2"></Star>
                        <span className="text-slate-400 text-sm text-center"> 
                          {rating} ({numRatings})
                        </span>
                      </div>
                  </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <Star className="w-8 h-8 stroke-slate-400"></Star>
            </div>
          </div>
        </CardContent>
      </Card> 
    )
}