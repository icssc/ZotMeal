import type { Href } from "expo-router";
import type { GetProps } from "tamagui";
import { router, useSegments } from "expo-router";
import {
  CalendarDays,
  ChevronRight,
  Home,
  Info,
  LogIn,
  Menu,
  Settings,
  Siren,
} from "@tamagui/lucide-icons";
import { Adapt, Button, ListItem, Popover, Separator, YGroup } from "tamagui";

interface Screen extends GetProps<typeof ListItem> {
  href: Href<"pathname">;
}

const screens = [
  {
    title: "Home",
    href: "/",
    subTitle: "See current menus",
    icon: Home,
  },
  {
    title: "Events",
    href: "/events",
    subTitle: "Upcoming events",
    icon: CalendarDays,
  },
  {
    title: "Settings",
    href: "/settings",
    subTitle: "Adjust your settings",
    icon: Settings,
  },
  {
    title: "About",
    href: "/about",
    subTitle: "Learn about ZotMeal",
    icon: Info,
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    subTitle: "About your privacy",
    icon: Siren,
  },
  {
    title: "Your Account",
    href: "/auth",
    subTitle: "Sign in to your account",
    icon: LogIn,
  },
] as const satisfies Screen[];

// ! Forwarding ref from Popover.close to Link to ListItem does not work on android, so we have to use a workaround
// ! If its fixed later on, we can use the forwarded ref
export function HamburgerMenu() {
  const currentSegment = useSegments()[0] ?? "";

  return (
    <Popover
      placement="bottom-start"
      offset={{
        alignmentAxis: -5,
        mainAxis: 15,
      }}
    >
      <Popover.Trigger asChild theme="dark">
        <Button
          backgroundColor={0}
          paddingHorizontal="$4"
          paddingVertical={0}
          theme="dark"
          pressTheme
          icon={<Menu color="white" size="$2" />}
        />
      </Popover.Trigger>
      <Adapt when={"sm" as unknown as undefined} platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[65, 90]}>
          <Popover.Sheet.Frame padding="$4" paddingTop="0">
            <Separator
              marginVertical="$4"
              borderRadius="$10"
              borderWidth={3}
              width="$5"
              alignSelf="center"
            />
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
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
        <YGroup separator={<Separator />}>
          {screens.map(({ href, ...props }) => (
            <YGroup.Item key={href}>
              <ListItem
                {...props}
                size="$5"
                onPress={() => router.push(href)}
                pressTheme
                disabled={href.replace("/", "") === currentSegment}
                iconAfter={ChevronRight}
              />
              {/* <Popover.Close
                disabled={href.replaceAll("/", "") === currentSegment}
                asChild
                flexDirection="row"
              >
                <Link
                  href={href}
                  disabled={href.replaceAll("/", "") === currentSegment}
                  replace
                  asChild
                >
                  <ListItem
                    {...props}
                    size="$5"
                    pressTheme
                    disabled={href.replaceAll("/", "") === currentSegment}
                    iconAfter={ChevronRight}
                  />
                </Link>
              </Popover.Close> */}
            </YGroup.Item>
          ))}
        </YGroup>
      </Popover.Content>
    </Popover>
  );
}
