import React from "react";
import {View, Text, StyleSheet} from "react-native";
import "./Item.css"

function Item(props: any) {

    const itemName = props.info.name
    const description = props.info.description
    const nutrition = props.info.nutrition

    return (
        <div>
            <div className="row-divider"></div>
            <div className="item">
                <p className="item-name">{itemName}</p>
                <p className="item-calories">{nutrition.calories}</p>
            </div>
        </div>
    )
}

export default Item