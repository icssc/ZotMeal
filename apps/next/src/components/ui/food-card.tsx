"use client";

import { DishInfo } from "@zotmeal/api";
import { Dialog, DialogTrigger } from "./dialog"
import FoodCardContent from "./food-card-content";
import FoodDialogContent from "./food-dialog-content"


export default function FoodCard(dish: DishInfo) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FoodCardContent dish={dish}/>
        </DialogTrigger>
        <FoodDialogContent {... dish}/>
      </Dialog>
    )
}