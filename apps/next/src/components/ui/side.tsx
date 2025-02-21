import { AspectRatio } from "./aspect-ratio";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { HallStatusEnum, DiningHallStatus } from "./status";

export default function Side() {
    return (
      <div className="z-0">
        <Image 
          className="object-cover object-bottom w-full max-h-80"
          src="/brandywine.webp"
          alt="An image of brandywine"
          width={2000}
          height={2000}
        />
        <div className="p-5">
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select meal"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="latenite">Latenite</SelectItem>
              </SelectContent>
            </Select>
            <DiningHallStatus
              status={HallStatusEnum.OPEN}
              openTime="8:00a"
              closeTime="8:00p"
            />
          </div>
        </div>
      </div>
    )
}