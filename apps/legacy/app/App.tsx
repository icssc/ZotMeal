import {View, StyleSheet, ScrollView} from 'react-native';
import Location from "../shared/assets/components/Location";

export default function App() {
  return (
      <ScrollView style={styles.home}>
        <Location location="brandywine"/>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
    home: {
        backgroundColor: "#121212",
        padding: "2%"
    }
})
