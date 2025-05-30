import { StatusColors, HallStatusEnum } from "@/utils/types";

function StatusDot({ status } : { status: HallStatusEnum }) {
    switch (status) {
        case HallStatusEnum.OPEN:
            return (<div className={`w-2 h-2 p-1 rounded-full bg-emerald-500`}/>)
        case HallStatusEnum.CLOSED:
            return (<div className={`w-2 h-2 p-1 rounded-full bg-red-500`}/>)
        case HallStatusEnum.ERROR:
            return (<div className={`w-2 h-2 p-1 rounded-full bg-amber-500`}/>)
        case HallStatusEnum.PREVIEW:
            return (<div className={`w-2 h-2 p-1 rounded-full bg-sky-500`}/>)
    }
}

interface StatusProps {
    status: HallStatusEnum;
    openTime: string;
    closeTime: string;
}

function DiningHallStatus({
    status, 
    openTime, 
    closeTime
} : StatusProps) {
    let statusMessage: string = "";

    switch (status) {
        case HallStatusEnum.OPEN:
            statusMessage = `Open (${openTime} - ${closeTime})`
            break;
        case HallStatusEnum.CLOSED:
            statusMessage = `Closed`
            break;
        case HallStatusEnum.ERROR:
            statusMessage = `Error (Cannot obtain scheduling info)`
            break;
        case HallStatusEnum.PREVIEW:
            statusMessage = `Preview`
        default:
            break;
    }

    return (
        <div className="flex items-center gap-2">
            <StatusDot status={status}/>
            <span>{statusMessage}</span>
        </div>
    )
}

export { DiningHallStatus }