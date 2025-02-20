import Image from "next/image"
import { AspectRatio } from "./aspect-ratio"
import { Card, CardContent, CardHeader } from "./card"
import { Star } from "lucide-react"

export default function ZotMealCard() {
    return (
        <Card>
            <CardContent>
            <div className="flex items-center gap-6 h-full pt-6">
                <Image 
                  src="/next.svg"
                  alt="food image"
                  width={32}
                  height={32}
                  className="rounded-sm"
                />
                    <div className="flex flex-col">
                        <strong>Food Name</strong>
                        <div className="flex gap-2 items-center">
                            <span>110 cal</span>
                            <div className="flex gap-1 items-center">
                                <Star className="w-4 stroke-slate-400 stroke-2"></Star>
                                <span className="text-slate-400 text-sm text-center"> 4.5 (1231)</span>
                            </div>
                        </div>
                    </div>
            </div>
            </CardContent>
        </Card> 
    )
}