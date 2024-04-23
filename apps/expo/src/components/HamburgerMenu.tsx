import type { Href } from "expo-router";
import { Link, useSegments } from "expo-router";
import {
  CalendarDays,
  ChevronRight,
  Home,
  Info,
  Menu,
  Settings,
  Siren,
} from "@tamagui/lucide-icons";
import { Adapt, Button, ListItem, Popover, Separator, YGroup } from "tamagui";

export default function HamburgerMenu() {
  const currentSegment = useSegments()[0] ?? "";
  const screens: Record<
    string,
    {
      path: Href<"pathname">;
      description: string;
      icon: typeof Home;
    }
  > = {
    Home: {
      path: "/",
      description: "See current menus",
      icon: Home,
    },
    Events: {
      path: "/events/",
      description: "Upcoming events",
      icon: CalendarDays,
    },
    Settings: {
      path: "/settings/",
      description: "Adjust your settings",
      icon: Settings,
    },
    About: {
      path: "/about/",
      description: "Learn about ZotMeal",
      icon: Info,
    },
    "Privacy Policy": {
      path: "/privacy-policy/",
      description: "About your privacy",
      icon: Siren,
    },
  };

  return (
    <Popover placement="top">
      <Popover.Trigger asChild theme="dark">
        <Button
          backgroundColor={0}
          paddingHorizontal="$4"
          paddingVertical={0}
          theme="dark"
          pressTheme
        >
          <Menu color="white" size="$2" />
        </Button>
      </Popover.Trigger>
      <Adapt when={"sm" as unknown as undefined} platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[55]}>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="quickest"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          "quickest",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <YGroup separator={<Separator />}>
          {Object.entries(screens).map(
            ([name, { path, description, icon }]) => (
              <YGroup.Item key={name}>
                <Popover.Close
                  asChild
                  disabled={path.replaceAll("/", "") === currentSegment}
                  flexDirection="row"
                >
                  <Link
                    replace
                    href={path}
                    asChild
                    disabled={path.replaceAll("/", "") === currentSegment}
                  >
                    <ListItem
                      size="$5"
                      pressTheme
                      title={name}
                      subTitle={description}
                      disabled={path.replaceAll("/", "") === currentSegment}
                      icon={icon}
                      iconAfter={ChevronRight}
                    />
                  </Link>
                </Popover.Close>
              </YGroup.Item>
            ),
          )}
        </YGroup>
      </Popover.Content>
    </Popover>
  );
}
