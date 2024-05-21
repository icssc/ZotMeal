import { Link } from "expo-router";
import { ArrowRight, CalendarDays } from "@tamagui/lucide-icons";
import { Toast, useToastState } from "@tamagui/toast";
import { Button } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";



export function EventToast() {
  const currentToast = useToastState();
  if (!currentToast || currentToast.isHandledNatively) return null;
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 1, y: 50 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      // y={0}
      opacity={1}
      scale={1}
      animation="quicker"
      viewportName={currentToast.viewportName}
      borderRadius="$4"
      flexDirection="row"
      width="90%"
      height="$6"
      alignItems="center"
      justifyContent="space-between"
    >
      <CalendarDays />
      <Toast.Title fontWeight="800">{currentToast.title}</Toast.Title>
      <LinearGradient
        colors={["cornflowerblue", "blueviolet"]}
        borderRadius="$20"
      >
        <Toast.Action altText="See Events" asChild>
          <Link href="/events/" asChild replace>
            <Button
              backgroundColor={0}
              pressTheme
              size="$4"
              circular
              color="white"
              icon={ArrowRight}
              scaleIcon={1.5}
            />
          </Link>
        </Toast.Action>
      </LinearGradient>
    </Toast>
  );
}
