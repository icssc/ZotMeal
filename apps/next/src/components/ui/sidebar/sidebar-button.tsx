import { Button } from "../shadcn/button"
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SheetClose } from "../shadcn/sheet";

interface SidebarButtonProps {
    Icon: React.ElementType;
    title: string;
    href: string;
    deactivated?: boolean;
} 

export default function SidebarButton({Icon, title, href, deactivated} : SidebarButtonProps) {
  const buttonContent = (
        <Button variant={deactivated ? "deactivated" : "ghost"} className="justify-between [&_svg]:size-5" asChild>
          <Link href={deactivated ? "#" : href}>
            <div className="flex gap-3 items-center">
                <Icon className="stroke-1"/>
                <span className="text-md">{title}</span>
            </div>
            <ChevronRight className="stroke-1"/>
          </Link>
        </Button>
  )

  if (deactivated)
      return buttonContent;
  else
      return (
        <SheetClose asChild>
          {buttonContent}
        </SheetClose>
      )

}