import { useMemo } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import type { MaterialBottomTabNavigationOptions } from "react-native-paper/react-navigation";
import {
  createStackNavigator,
  type StackScreenProps,
} from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Home } from "./+page";
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import type {
  StackHeaderProps,
  StackNavigationOptions,
} from "@react-navigation/stack";

/**
 * Screen info.
 */
export type ScreenInfo<T extends Record<string, any> = any> = {
  name: keyof T;
  component: React.JSXElementConstructor<StackScreenProps<T>>;
};

/**
 * Routes.
 */
export const routes = {
  Home: {
    name: "Home",
    component: BottomTabScreen,
    options: {
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="home" color={color} size={26} />
      ),
    } as MaterialBottomTabNavigationOptions,
  },
} as const;

/**
 * Entries of routes.
 */
export const routeEntries = Object.entries(routes);

/**
 * Names of screens mapped to their params.
 */
export const screens = {
  HomeScreen: undefined,
};

/**
 * Translates route names to their corresponding screen info.
 */
export const routeScreenInfo: Record<
  (typeof routes)[keyof typeof routes]["name"],
  ScreenInfo<typeof screens>
> = {
  Home: {
    name: "HomeScreen",
    component: Home,
  },
};

export const routeScreenInfoEntries = Object.entries(routeScreenInfo);

/**
 * Shared stack navigator.
 */
export const StackNavigator = createStackNavigator<typeof screens>();

function getTitle(name: string, options: StackNavigationOptions) {
  const screenInfo = routeScreenInfoEntries.find(
    ([, screenInfo]) => screenInfo.name === name,
  );

  return screenInfo ? screenInfo[0] : getHeaderTitle(options, name);
}

export function Header(props: StackHeaderProps) {
  const title = useMemo(
    () => getTitle(props.route.name, props.options),
    [props.route.name, props.options],
  );

  return (
    <Appbar.Header>
      {props.back && <Appbar.BackAction onPress={props.navigation.goBack} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

export function BottomTabScreen(props: BottomTabScreenProps<typeof routes>) {
  /**
   * Based on the current route, we need to sort the screens so that the current screen is rendered first.
   */
  const sortedRouteNames = useMemo(() => {
    return routeEntries
      .sort((x, y) => {
        return x[0] === props.route.name
          ? -1
          : y[0] === props.route.name
            ? 1
            : 0;
      })
      .map(([name]) => name as keyof typeof routes);
  }, [props.route.name]);

  return (
    <StackNavigator.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      {sortedRouteNames.map((name) => (
        <StackNavigator.Screen
          key={name}
          name={routeScreenInfo[name].name}
          component={routeScreenInfo[name].component}
        />
      ))}
    </StackNavigator.Navigator>
  );
}
