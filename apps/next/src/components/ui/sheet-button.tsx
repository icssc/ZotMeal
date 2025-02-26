import { Button } from "./button"
import { ChevronRight } from "lucide-react";

interface SheetButtonProps {
    Icon: React.ElementType;
    title: string;
} 

export default function SheetButton({Icon, title} : SheetButtonProps) {
    return (
        <Button variant="ghost" className="justify-between [&_svg]:size-5">
            <div className="flex gap-3 items-center">
                <Icon className="stroke-1"/>
                <span className="text-md">{title}</span>
            </div>
            <ChevronRight className="stroke-1"/>
        </Button>
    )
}