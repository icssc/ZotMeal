// Displays a list of food items in a table
// Looks like this:
// Dish          Calories
// Item 1        #
// Item 2        #
/// ....

import React, {ReactElement, useEffect, useState} from "react";
import Item from "./Item";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {ItemInfo, MenuInfo} from "../../../lib/zotmeal.types";
import ColorPalette from "../ColorPalette";


function Menu(props: {info: MenuInfo}){

    const itemCategory = props.info.category
    const itemList = props.info.items

    let truncatedList: ItemInfo[] = []
    let expandableSection: ItemInfo[] = []
    let expandButton = null
    let hiddenList: ItemInfo[] = []

    const [expanded, setExpanded] = useState(false)

    useEffect(() => {})


    //If the list is larger than 4 make rows expandable
    if (itemList.length > 4){
        truncatedList = itemList.slice(0, 4)
        hiddenList = itemList.slice(4, )

        expandButton = <Pressable onPress={() => setExpanded(!expanded)}>
            <Text style={styles.expand}>{expanded? 'Show Less ^' : 'Show More ˅'}</Text>
        </Pressable>

        hiddenList.forEach((item: ItemInfo) => {
            expandableSection.push(item)
        })
    }
    //Otherwise make the rows normal
    else{
        truncatedList = itemList
    }

    //Display HTML
    return (
        <View style={styles.menu}>
            <Text style={styles.itemCategory}>
                {itemCategory} ({itemList.length})
            </Text>
            <View style={styles.itemList}>
                <View style={styles.itemLabels}>
                    <Text style={styles.label}>Dish</Text>
                    <Text style={styles.label}>Calories</Text>
                </View>

                {truncatedList.map((item: ItemInfo) =>
                    <Item key={item.name} info={item}/>
                )}
                {expanded ?
                    expandableSection.map((item: ItemInfo) =>
                    <Item key={item.name} info={item}/>)
                    : null
                }
                {expandButton}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    menu: {
        marginTop: 3,
        marginRight: 3,
        marginBottom: 3,
        marginLeft: 3,
        minWidth: 213,
        maxWidth: 213,
        borderWidth: 2,
        borderColor: ColorPalette.rowDivider,
        borderStyle: "solid",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: ColorPalette.bgColor
    },

    itemCategory: {
        display: "flex",
        paddingTop: "1%",
        paddingRight: "1%",
        paddingBottom: "1%",
        paddingLeft: "6%",
        justifyContent: "flex-start",
        backgroundColor: ColorPalette.bgColorBlue,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        color: ColorPalette.textColor,
        fontWeight: "500",
        fontSize: 16,
    },

    itemList: {
        paddingTop: "5%",
        paddingRight: "5%",
        paddingBottom: "3%",
        paddingLeft: "5%",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        display: "grid"
    },

    itemLabels: {
        display: "grid",
        justifyContent: "space-between",
        gridTemplateColumns: "[line1] 60% [line2] auto [end]",
        paddingBottom: 3
    },

    label: {
        marginTop: 2,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 2,
        fontSize: 12,
        color: ColorPalette.textColor,
        //fontFamily: "SF Pro Light"
    },

    expand: {
        color: ColorPalette.bgColorBlue,
        backgroundColor: ColorPalette.bgColor,
        padding: 0,
        display: "flex",
        justifyContent: "center",
    }
})

export default Menu;