import Location from "./Location";
import React, {Children, useEffect, useState} from "react";
import "./Home.css";
import {View, Text, StyleSheet, DimensionValue} from "react-native";

import ColorPalette from "./ColorPalette";


function Home(){
    const [matches, setMatches] = useState(
        window.matchMedia("all and (max-width:850px)").matches
      )

    useEffect(() => {
       window.matchMedia("all and (max-width:850px)").addEventListener('change', e => {
           setMatches( e.matches )
       });
    }, []);

    //<SwipeableViews enableMouseEvents disabled={!matches} index={slideIndex} onChangeIndex={handleSwitch} className="home">
    //</SwipeableViews>

    return (
        <MainSwipeView disabled={!matches}>
            <View style={styles.location1}>
                <View style={{width: matches ? "100%" : "calc(100% - 4px)"}}>
                    <Location location = "brandywine"/>
                </View>
                {matches ? null : <View style={styles.columnDivider}/>}
            </View>
            <Location location = "anteatery"/>
        </MainSwipeView>
    )
}

function MainSwipeView(props: {children: Element[], disabled: boolean}) {

    const [slideIndex, setSlideIndex] = useState(0);

    const handleSwitch = (index: number, type: any) => {
        setSlideIndex(index)
    }

    useEffect(() => {
        if (props.disabled)
        {
            setSlideIndex(0)
        }
     }, []);

    return (
        <View style={styles.swipeView}>
            {props.children.map((child: Element) => {
                return (<View style={{width: (props.disabled ? "50%" : "100%")}}>
                    {child}
                </View>)
            })}
        </View>
    )
}


const styles = StyleSheet.create({
    swipeView: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        backgroundColor: ColorPalette.bgColor
    },

    location1: {
        flexDirection: "row",
        gap: "0px",
        maxWidth: "100%"
    },

    columnDivider: {
        backgroundColor: ColorPalette.textColor,
        width: "4px",
    }
})

export default Home