"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/utils/tw"
import { Button } from "@/components/ui/shadcn/button"
import { Calendar } from "@/components/ui/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import type { DateList } from "../toolbar"
import { isSameDay } from "@/utils/funcs"

export function DatePicker({date, enabledDates, onSelect} : {
    date: Date | undefined,
    enabledDates: DateList,
    onSelect: (newDateFromPicker : Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          disabled={(d) => 
            (date ? isSameDay(d, date) : true)
            || !enabledDates?.some(
              ed => ed.getTime() === d.getTime()
          )}
        />
      </PopoverContent>
    </Popover>
  )
}
