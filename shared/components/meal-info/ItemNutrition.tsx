// Displays all the nutritional information about the

import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Nutrition} from "../../../shared/lib/zotmeal.types";
import ColorPalette from "../ColorPalette";

function ItemNutrition(props: {nutrition: Nutrition}) {
    return(
        <View style={{flexDirection: "row"}}>
            {/* Left Column*/}
            <View style={styles.leftColumn}>
                <View style={styles.twoColumn}>
                    <Text style={{fontWeight: "bold"}}>Calories</Text>
                    <Text style={{fontWeight: "bold"}}>{props.nutrition.calories} kCal</Text>
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
                    <Text style={{fontWeight: "bold"}}>Total Fat</Text>
                    <Text style={{fontWeight: "bold"}}>{props.nutrition.totalFat} g</Text>
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
                    <Text>Trans Fat</Text>
                    <Text>{props.nutrition.transFat} g</Text>
                </View>
                {/*-----------------*/}
                <View style={styles.rowDivider}></View>

                <View style={styles.twoColumn}>
                    <Text style={{fontWeight: "bold"}}>Cholesterol</Text>
                    <Text style={{fontWeight: "bold"}}>{props.nutrition.cholesterol} mg</Text>
                </View>
                {/*-----------------*/}
                <View style={styles.rowDivider}></View>

                <View style={styles.twoColumn}>
                    <Text style={{fontWeight: "bold"}}>Sodium</Text>
                    <Text style={{fontWeight: "bold"}}>{props.nutrition.sodium} mg</Text>
                </View>
            </View>

            {/* Right Column*/}
            <View style={styles.rightColumn}>
                <View style={styles.twoColumn}>
                    <Text style={{fontWeight: "bold"}}>Total Carbohydrates</Text>
                    <Text style={{fontWeight: "bold"}}>{props.nutrition.totalCarbohydrates} g</Text>
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
                    <Text>Sugars</Text>
                    <Text>{props.nutrition.sugars} g</Text>
                </View>
                {/*-----------------*/}
                <View style={styles.rowDivider}></View>

                <View style={styles.twoColumn}>
                    <Text style={{fontWeight: "bold"}}>Protein</Text>
                    <Text style={{fontWeight: "bold"}}>{props.nutrition.protein} g</Text>
                </View>
                {/*-----------------*/}
                <View style={styles.rowDivider}></View>

                <View style={styles.twoColumn}>
                    <Text>Vitamin C</Text>
                    <Text>{props.nutrition.vitaminC} IU</Text>
                </View>
                {/*-----------------*/}
                <View style={styles.rowDivider}></View>

                <View style={styles.twoColumn}>
                    <Text>Calcium</Text>
                    <Text>{props.nutrition.calcium} mg</Text>
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
                    <Text>Calories From Fat</Text>
                    <Text>{props.nutrition.caloriesFromFat} kCal</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowDivider: {
        height: 1,
        backgroundColor: ColorPalette.rowDivider
    },

    leftColumn: {
        flex: 1,
        padding: "2%",
        paddingLeft: "0%",
        borderRightWidth: 1,
        borderRightColor: ColorPalette.rowDivider
    },

    rightColumn: {
        flex: 1,
        padding: "2%",
        paddingRight: "0%",
        borderLeftWidth: 1,
        borderLeftColor: ColorPalette.rowDivider
    },

    twoColumn: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingTop: "1%",
        paddingBottom: "1%",
    }
})

export default ItemNutrition