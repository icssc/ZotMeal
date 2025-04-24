'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Test() {
  return (
    <div className="w-full h-full pt-28">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Hello!
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Hello!</DialogTitle>
          <DialogDescription>Hello.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}