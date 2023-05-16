// Formatting for individual menu items
// Only displays item name and calorie count

import React, {useState} from "react";
import {
    View, Text, StyleSheet, Pressable, Modal,
    ScrollView, TouchableWithoutFeedback, Image
} from "react-native";
import ItemNutrition from "./ItemNutrition";
import {ItemInfo} from "../typedef";
import ColorPalette from "../ColorPalette";

// Nutrition Badge Images


const nutritionBadgeImages = [require("@assets/Vegan.png"), require("@assets/Vegetarian.png"),
    require("@assets/EatWell.png"), require("@assets/PlantForward.png"), require("@assets/WholeGrains.png")]

// Takes "info" prop that is the item json for one item on a Menu
// Sets up the display for the modal that shows
// more details about the item
function Item(props: {info: ItemInfo}) {

    const itemName = props.info.name
    const nutrition = props.info.nutrition

    const [detailsOpen, setDetailsOpen] = useState(false)

    return (
        <Pressable onPress={() => setDetailsOpen(true)}>
            <ItemDisplay itemName={itemName} calories={nutrition.calories}/>
            <Modal visible={detailsOpen} transparent={true} animationType={"fade"}>
                <Pressable style={modalStyles.backgroundFilter} onPress={() => setDetailsOpen(false)}>
                    <View style={modalStyles.modalView}>

                        {/* Inside the modal */}
                        <View style={{alignItems: "right"}}>
                            <Pressable onPress={() => setDetailsOpen(false)} style={{width: "5%"}}>
                                <Text style={modalStyles.exitButton}>X</Text>
                            </Pressable>
                        </View>
                        <TouchableWithoutFeedback>
                            <ScrollView style={{padding: "3%"}}>
                                <ItemDetails itemInfo={props.info} nutritionOpen={true}/>
                            </ScrollView>
                        </TouchableWithoutFeedback>

                    </View>
                </Pressable>
            </Modal>
        </Pressable>
    )
}

// Takes two parameters:
// "name" and "calories"
// Displays the item as seen on the Menu
function ItemDisplay(props: {itemName: string, calories: number}) {
    const itemName = props.itemName
    const calories = props.calories

    return (
        <View>
            <View style={displayStyles.rowDivider}></View>
            <View style={displayStyles.item}>
                <Text style={displayStyles.itemName}>{itemName}</Text>
                <Text style={displayStyles.itemCalories}>{calories}</Text>
            </View>
        </View>
    )
}

// Takes in one parameter
// "itemInfo" that is all info about the menu item
// Displays more information about the item when
// it is clicked on the menu
export function ItemDetails(props: {itemInfo: ItemInfo, nutritionOpen: boolean}) {
    const itemInfo = props.itemInfo

    const [showNutrition, setShowNutrition] = useState(props.nutritionOpen)

    const nutritionInfo = itemInfo.nutrition
    const nutritionBadges = [nutritionInfo.isVegan, nutritionInfo.isVegetarian,
        nutritionInfo.isEatWell, nutritionInfo.isPlantForward, nutritionInfo.isWholeGrain]

    return (
        <View>
            {/* Displays the name of the item*/}
            <View style={detailStyles.title}>
                <View>
                    <Text style={detailStyles.titleText}>{itemInfo.name}</Text>
                    <Text style={{color: ColorPalette.textColor}}>{itemInfo.nutrition.calories} calories</Text>
                </View>
                <Text>iframe</Text>
            </View>
            <View style={displayStyles.rowDivider}></View>

            {/* Displays the description of the item*/}
            <View style={detailStyles.description}>
                <Text style={detailStyles.subtitleText}>Description</Text>
                <Text style={{color: ColorPalette.textColor}}>{itemInfo.description}</Text>
            </View>
            <View style={displayStyles.rowDivider}></View>

            <View style={detailStyles.nutritionTitle}>
                <View>
                    <Text style={detailStyles.subtitleText}>Nutrition Info</Text>
                </View>
                <Pressable onPress={() => setShowNutrition(!showNutrition)}>
                    <Text style={detailStyles.expandButton}>{showNutrition ? "Retract ^" : "Expand V"}</Text>
                </Pressable>
            </View>
            <View style={displayStyles.rowDivider}></View>

            {/* Displays the nutrition information about the item*/}
            {showNutrition ? <ItemNutrition nutrition={nutritionInfo}/> : null}
            <View style={displayStyles.rowDivider}></View>

            {/* Displays the nutrition badges of the item*/}
            <View style={detailStyles.nutritionTitle}>
                <Text style={detailStyles.subtitleText}>Nutrition Badges(s)</Text>
                <Text style={detailStyles.subtitleText}>0</Text>
            </View>
            <View style={displayStyles.rowDivider}></View>

            <Image
                source={require('../imageAssets/Vegan.png').default}
              />

            {/*<View style={detailStyles.nutritionBadges}>
                {nutritionBadges.map((badge : boolean, index : number) => {
                    return (
                        badge ? <Image source={require(nutritionBadgeImages[index])}/> : null
                    )
                })}
            </View>*/}

        </View>
    )
}

const displayStyles = StyleSheet.create({
    item: {
        display: "grid",
        justifyContent: "space-between",
        gridTemplateColumns: "[line1] 75% [line2] auto [end]",
        marginTop: "3%",
        marginBottom: "3%"
    },

    itemName: {
        margin: 0,
        color: ColorPalette.textColor,
        fontWeight: "500",
    },

    itemCalories: {
        margin: 0,
        color: ColorPalette.textColor,
    },

    rowDivider: {
        height: 1,
        backgroundColor: ColorPalette.rowDivider
    }
})

const modalStyles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: ColorPalette.bgColor,
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: "90%",
        minWidth: "50%",
    },

    backgroundFilter: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: "center",
    },

    centerView: {
        alignItems: 'center',
    },

    exitButton: {
        color: ColorPalette.textColor,
        fontWeight: "bold",
    },

    white: {
        color: ColorPalette.bgColor
    },
})

const detailStyles = StyleSheet.create({
    titleText :{
        color: ColorPalette.textColor,
        fontWeight: "bold",
        fontSize: 24,
    },

    title: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    description: {
        marginTop: 10,
        marginBottom: 10,
    },

    subtitleText: {
        color: ColorPalette.textColor,
        fontWeight: "bold",
        fontSize: 16,
    },

    nutritionTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
    },

    expandButton: {
        color: ColorPalette.bgColorBlue,
        fontSize: 15,
    },

    nutritionBadges: {
        flexDirection: "row",
        margin: "3%",
    }
})

export default Item