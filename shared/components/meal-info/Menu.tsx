import React, {ReactElement, useEffect, useState} from "react";
import Item from "./Item";
import "./Menu.css"
import item from "./Item";
import {Pressable, StyleSheet, Text, View} from "react-native";


function Menu(props: any){

    const itemCategory = props.info.category
    const itemList = props.info.items

    let truncatedList: ReactElement[] = []
    let expandableSection: Object[] = []
    let expandButton = null
    let hiddenList: ReactElement[] = []

    const [expanded, setExpanded] = useState(false)

    useEffect(() => {})


    //If the list is larger than 4 make rows expandable
    if (itemList.length > 4){
        truncatedList = itemList.slice(0, 4)
        hiddenList = itemList.slice(4, )

        expandButton = <Pressable onPress={() => setExpanded(!expanded)}>
            <Text style={styles.expand}>{expanded? 'Show Less ^' : 'Show More ˅'}</Text>
        </Pressable>

        hiddenList.forEach((item: Object) => {
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

                {truncatedList.map((item: Object) =>
                    <Item key={item.name} info={item}/>
                )}
                {expandableSection.map((item: Object) =>
                    <View style={hidden(expanded)}>
                        <Item key={item.name} info={item}/>
                    </View>
                )}
                {expandButton}
            </View>
        </View>
    )
}

const hidden = function(expanded: boolean) {
    if (expanded)
        return
    else
    {
        return {
            display: "none",
        }
    }
}

const styles = StyleSheet.create({
    menu: {
        marginTop: 3,
        marginRight: 3,
        marginBottom: 3,
        marginLeft: 3,
        minWidth: 203,
        maxWidth: 203,
        borderWidth: 2,
        borderColor: "white",
        borderStyle: "solid",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: "#303030"
    },

    itemCategory: {
        display: "flex",
        paddingTop: "1%",
        paddingRight: "1%",
        paddingBottom: "1%",
        paddingLeft: "1%",
        justifyContent: "center",
        backgroundColor: "#535bf2",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },

    itemList: {
        paddingTop: "3%",
        paddingRight: "3%",
        paddingBottom: "3%",
        paddingLeft: "3%",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        display: "grid"
    },

    itemLabels: {
        display: "grid",
        justifyContent: "space-between",
        fontSize: 11,
        gridTemplateColumns: "[line1] 60% [line2] auto [end]"
    },

    label: {
        marginTop: 2,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 2,
        //fontFamily: "SF Pro Light"
    },

    expand: {
        color: "#535bf2",
        backgroundColor: "#303030",
        padding: 0,
        display: "flex",
        justifyContent: "center",
    }
})

export default Menu;