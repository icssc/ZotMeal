import Side from "@/components/ui/side";
import { HallEnum } from "@/utils/types";

export default function Home() {
  return (
    <div className="grid grid-cols-2 grid-rows-1 max-w-full h-screen">
      <Side
        hall={HallEnum.BRANDYWINE}
      />
      <Side
        hall={HallEnum.ANTEATERY}
      />
    </div>
  );
}
