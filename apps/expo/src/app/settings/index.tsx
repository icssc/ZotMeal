import { H3, RadioGroup, Separator, YStack } from "tamagui";

import { RadioGroupItemWithLabel, SwitchWithLabel } from "~/components/ui";
import { useSettingsStore } from "~/utils";

export default function Settings() {
  const { colorSchemePreference, setColorSchemePreference } =
    useSettingsStore();

  return (
    <YStack margin="$5">
      <H3>Settings</H3>
      <Separator borderWidth={1} />
      <RadioGroup
        aria-labelledby="Select color scheme setting"
        name="color-scheme-form"
        value={colorSchemePreference}
        onValueChange={(value) =>
          setColorSchemePreference(value as "light" | "dark" | "system")
        }
      >
        <YStack width={300} alignItems="center" gap="$2">
          <RadioGroupItemWithLabel size="$5" value="light" label="Light" />
          <RadioGroupItemWithLabel size="$5" value="dark" label="Dark" />
          <RadioGroupItemWithLabel size="$5" value="system" label="System" />
        </YStack>
      </RadioGroup>
      <SwitchWithLabel label="Switch for fun" size="$4" />
    </YStack>
  );
}
