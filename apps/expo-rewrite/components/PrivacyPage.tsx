import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    header: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
    },
});

export default function PrivacyPage() {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>
                    ZotMeal Privacy Policy
                </Text>

                <Text style={styles.text}>
                    ZotMeal is a cross-platform mobile application designed to help users view 
                    dining hall menus at the University of California, Irvine (UCI). We value 
                    your privacy and are committed to protecting any personal information you 
                    may share with us.
                </Text>

                <Text style={styles.text}>
                    ZotMeal does not collect or store any personally identifiable information 
                    (PII). The app does not require login or account creation. We do not track 
                    or monitor user behavior within the app.
                </Text>

                <Text style={styles.text}>
                    ZotMeal fetches dining hall menu data from publicly available or authorized 
                    UCI resources. This data is used solely to display daily menus within the app 
                    and is not shared or stored beyond your device.
                </Text>

                <Text style={styles.text}>
                    This privacy policy may be updated from time to time. Users will be notified 
                    of any significant changes through the app or update notes.
                </Text>
            </View>
        </ScrollView>
    );
}