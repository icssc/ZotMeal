import React from "react";
import { Label, Separator, SizeTokens, Switch, XStack } from "tamagui";

/**
 *  Component from tamagui docs
 *
 *  @see https://tamagui.dev/ui/switch/1.89.0
 */
export function SwitchWithLabel(props: {
  label: string;
  size: SizeTokens;
  defaultChecked?: boolean;
}) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ""}}`;
  return (
    <XStack width={200} alignItems="center" gap="$4">
      <Label
        paddingRight="$0"
        minWidth={90}
        justifyContent="flex-end"
        size={props.size}
        htmlFor={id}
      >
        {props.label}
      </Label>
      <Separator minHeight={20} vertical />
      <Switch id={id} size={props.size} defaultChecked={props.defaultChecked}>
        <Switch.Thumb animation="quicker" />
      </Switch>
    </XStack>
  );
}
