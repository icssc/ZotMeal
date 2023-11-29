import { PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { NavigationContainer } from "@react-navigation/native";
import { routes, routeEntries } from "./routes/+layout";

const MaterialBottomTabNavigator =
  createMaterialBottomTabNavigator<typeof routes>();

export function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <MaterialBottomTabNavigator.Navigator>
          {routeEntries.map(([name, routeConfig]) => (
            <MaterialBottomTabNavigator.Screen key={name} {...routeConfig} />
          ))}
        </MaterialBottomTabNavigator.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
