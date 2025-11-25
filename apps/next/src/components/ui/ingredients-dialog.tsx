import { Button } from "./shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/dialog";

interface IngredientsDialogProps {
  name: string;
  ingredients: string;
}

export default function IngredientsDialog({
  name,
  ingredients,
}: IngredientsDialogProps): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          Show All Ingredients
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="px-5 pt-5">{name} Ingredients</DialogTitle>
        <p className="px-5 text-sm max-h-48 overflow-y-scroll">{ingredients}</p>
      </DialogContent>
    </Dialog>
  );
}
