// Displays all the nutritional information about the

import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Nutrition} from "../typedef";
import ColorPalette from "../ColorPalette";

function ItemNutrition(props: {nutrition: Nutrition}) {
    return(
        <View>
            <View style={styles.twoColumn}>
                <Text>Calcium</Text>
                <Text>{props.nutrition.calcium} mg</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Calories</Text>
                <Text>{props.nutrition.calories} kCal</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Calories From Fat</Text>
                <Text>{props.nutrition.caloriesFromFat} kCal</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Cholesterol</Text>
                <Text>{props.nutrition.cholesterol} mg</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Dietary Fiber</Text>
                <Text>{props.nutrition.dietaryFiber} g</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Iron</Text>
                <Text>{props.nutrition.iron} mg</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Protein</Text>
                <Text>{props.nutrition.protein} g</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Saturated Fat</Text>
                <Text>{props.nutrition.saturatedFat} g</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Serving Size</Text>
                <Text>{props.nutrition.servingSize} serving(s)</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Serving Unit</Text>
                <Text>{props.nutrition.servingUnit}</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Sodium</Text>
                <Text>{props.nutrition.sodium} mg</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Sugars</Text>
                <Text>{props.nutrition.sugars} g</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Total Carbohydrates</Text>
                <Text>{props.nutrition.totalCarbohydrates} g</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Total Fat</Text>
                <Text>{props.nutrition.totalFat} g</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Trans Fat</Text>
                <Text>{props.nutrition.transFat} g</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>

            <View style={styles.twoColumn}>
                <Text>Vitamin C</Text>
                <Text>{props.nutrition.vitaminC} IU</Text>
            </View>
            {/*-----------------*/}
            <View style={styles.rowDivider}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowDivider: {
        height: 1,
        backgroundColor: ColorPalette.rowDivider
    },

    twoColumn: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingTop: "1%",
        paddingBottom: "1%",
        paddingLeft: "3%",
        paddingRight: "3%",
    }
})

export default ItemNutrition