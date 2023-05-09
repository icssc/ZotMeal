// Formatting for individual menu items
// Only displays item name and calorie count

import React from "react";
import {View, Text, StyleSheet} from "react-native";

function Item(props: any) {

    const itemName = props.info.name
    const description = props.info.description
    const nutrition = props.info.nutrition

    return (
        <View>
            <View style={styles.rowDivider}></View>
            <View style={styles.item}>
                <Text style={styles.itemName}>{itemName}</Text>
                <Text style={styles.itemCalories}>{nutrition.calories}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        display: "grid",
        justifyContent: "space-between",
        gridTemplateColumns: "[line1] 75% [line2] auto [end]",
        marginTop: "3%",
        marginBottom: "3%"
    },

    itemName: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        color: "white"
    },

    itemCalories: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        color: "white"
    },

    rowDivider: {
        height: 1,
        backgroundColor: "#555555"
    }
})

export default Item