import Image from "next/image"
import { Card, CardContent} from "./card"
import { Star } from "lucide-react"
import { FoodCardProps } from "./food-card"

export default function FoodCardContent({
  title, 
  info, 
  hallInfo,
  imgSrc, 
  alt, 
  rating, 
  numRatings
} : FoodCardProps) {
    return (
          <Card className="cursor-pointer hover:shadow-lg transition">
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
                        <span>{info.calories} cal</span>
                          <div className="flex gap-1 items-center">
                            <Star className="w-4 stroke-zinc-400 stroke-2"></Star>
                            <span className="text-zinc-400 text-sm text-center"> 
                              {rating} ({numRatings})
                            </span>
                          </div>
                      </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <Star className="w-8 h-8 stroke-zinc-400"></Star>
                </div>
              </div>
            </CardContent>
          </Card> 
    )
}
