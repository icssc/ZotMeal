import { View } from "react-native";
import { Banner } from "./banner";
import { Navbar } from "./navbar";

export function Header() {
  return (
    <View>
      <Navbar />
      <Banner />
    </View>
  );
}
