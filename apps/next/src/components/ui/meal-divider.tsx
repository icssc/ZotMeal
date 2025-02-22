
interface MealDividerProps {
    title: string
}

export default function MealDivider({title} : MealDividerProps) {
    return (
        <div className="border-b-2">
            <h1 className="font-bold text-3xl">{title}</h1>
        </div>
    )
}