import { Stack } from "expo-router"
import { EventsProvider } from "./eventsContext"

export default function EventsLayout() {
    return (
        <EventsProvider>
            <Stack>
                <Stack.Screen name="index" options={{
                    headerShown: false
                }}/>
                <Stack.Screen name="event/[id]" options={{
                    headerBackTitle: "Events",
                    headerTitleStyle: { color: "white" },
                }}/>
            </Stack>
        </EventsProvider>
    )
}