import { Button } from "./button"
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SheetClose } from "./sheet";

interface SheetButtonProps {
    Icon: React.ElementType;
    title: string;
    href: string;
} 

export default function SheetButton({Icon, title, href} : SheetButtonProps) {
    return (
        <SheetClose asChild>
          <Button variant="ghost" className="justify-between [&_svg]:size-5" asChild>
            <Link href={href}>
              <div className="flex gap-3 items-center">
                  <Icon className="stroke-1"/>
                  <span className="text-md">{title}</span>
              </div>
              <ChevronRight className="stroke-1"/>
            </Link>
          </Button>
        </SheetClose>
    )
}