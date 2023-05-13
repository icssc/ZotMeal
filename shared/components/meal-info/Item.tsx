// Formatting for individual menu items
// Only displays item name and calorie count

import React, {useState} from "react";
import {View, Text, StyleSheet, Pressable, Modal} from "react-native";
import ItemNutrition from "./ItemNutrition";
import {ItemInfo} from "../typedef";

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
                <View style={modalStyles.backgroundFilter}>
                    <View style={modalStyles.modalView}>
                        <Pressable onPress={() => setDetailsOpen(false)} style={{alignItems: "right"}}>
                            <Text style={modalStyles.white}>X</Text>
                        </Pressable>
                        <ItemDetails itemInfo={props.info}/>
                    </View>
                </View>
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
function ItemDetails(props: {itemInfo: ItemInfo}) {
    const itemInfo = props.itemInfo

    const [showNutrition, setShowNutrition] = useState(true)

    return (
        <View>
            <View style={detailStyles.title}>
                <View>
                    <Text style={{color: "white", fontSize: 24}}>{itemInfo.name}</Text>
                    <Text style={{color: "white"}}>{itemInfo.nutrition.calories} calories</Text>
                </View>
                <Text>iframe</Text>
            </View>

            <View style={displayStyles.rowDivider}></View>

            <View style={detailStyles.description}>
                <Text style={{color: "white", fontSize: 16}}>Description</Text>
                <Text style={{color: "white"}}>{itemInfo.description}</Text>
            </View>

            <View style={displayStyles.rowDivider}></View>

            <View style={detailStyles.nutritionTitle}>
                <View>
                    <Text style={{color: "white", fontSize: 16}}>Nutrition Info</Text>
                </View>
                <Pressable onPress={() => setShowNutrition(!showNutrition)}>
                    <Text style={detailStyles.expandButton}>{showNutrition ? "Retract ^" : "Expand V"}</Text>
                </Pressable>
            </View>

            <View style={displayStyles.rowDivider}></View>

            {showNutrition ? <ItemNutrition nutrition={itemInfo.nutrition}/> : null}

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
        backgroundColor: "#777777"
    }
})

const modalStyles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: "#454545",
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
        minHeight: "100%",
    },

    backgroundFilter: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    centerView: {
        alignItems: 'center',
    },

    white: {
        color: "white"
    },
})

const detailStyles = StyleSheet.create({
    title: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
        marginBottom: 20,
    },

    description: {
        margin: 10,
    },

    nutritionTitle: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
        marginBottom: 0
    },

    expandButton: {
        color: "#4a92ff",
        fontSize: 15,
    },
})

export default Item