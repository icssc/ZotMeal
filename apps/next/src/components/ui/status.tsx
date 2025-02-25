enum StatusColors {
    OPEN = "bg-emerald-500",
    CLOSED = "bg-red-500",
    ERROR = "bg-amber-500"
};

enum HallStatusEnum {
    OPEN,
    CLOSED,
    ERROR
}

function StatusDot({ statusColor } : { statusColor: StatusColors }) {
    return (
        <div className={`w-2 h-2 rounded-full ${statusColor}`}/>
    )
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
    let statusDotColor: StatusColors;
    let statusMessage: string = "";

    switch (status) {
        case HallStatusEnum.OPEN:
            statusDotColor = StatusColors.OPEN;
            statusMessage = `Open (${openTime}-${closeTime})`
            break;
        case HallStatusEnum.CLOSED:
            statusDotColor = StatusColors.CLOSED;
            statusMessage = `Closed`
            break;
        case HallStatusEnum.ERROR:
            statusDotColor = StatusColors.ERROR;
            statusMessage = `Error (Cannot obtain scheduling info)`
            break;
        default:
            statusDotColor = StatusColors.OPEN;
            break;
    }

    return (
        <div className="flex items-center gap-2">
            <StatusDot statusColor={statusDotColor}/>
            <span>{statusMessage}</span>
        </div>
    )
}

export { HallStatusEnum, DiningHallStatus }