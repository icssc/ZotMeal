import { StarFull } from '@tamagui/lucide-icons'
import { Adapt, Button, H1, Popover, XStack, YStack } from 'tamagui'

export default function RateItem() {
  return (
    <Popover placement="top">
      <Popover.Trigger asChild width={"20%"}>
        <Button icon={<StarFull />} >5.0</Button>
      </Popover.Trigger>
      <Adapt when={"sm" as unknown as undefined} platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="lazy"
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
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >

        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
        <YStack space="$3" alignItems='center'>
          <H1 size="$3">

            Rate this item

          </H1>
          <XStack space="$3">
            <StarFull />
            <StarFull />
            <StarFull />
            <StarFull />
            <StarFull />
          </XStack>
          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}
            >

              Submit
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>

  )

}
