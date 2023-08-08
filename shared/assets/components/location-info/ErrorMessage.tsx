import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ColorPalette from "../ColorPalette";

function ErrorMessage() {
    return (
        <View style={styles.messageContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>We encountered an error getting the menu data. If the CampusDish website has the menu but we don't, please report the bug using the feedback button above.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        margin: "5%",
        minHeight: "70vh",
    },

    errorTitle: {
        marginBottom: "10px",
        fontSize: "1.5em",
        fontWeight: "bold",
        color: ColorPalette.textColor,
    },

    errorText: {
        fontWeight: "bold",
        color: ColorPalette.textColor,
    }
})

export default ErrorMessage