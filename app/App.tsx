import { View, StyleSheet} from 'react-native';
import Location from "components/Location";

export function App() {
  return (
      <View style={styles.home}>
        <Location location="brandywine"/>
      </View>
  );
}

const styles = StyleSheet.create({
    home: {
        backgroundColor: "#121212",
        padding: "2%"
    }
})
