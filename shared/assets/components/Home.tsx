import Location from "./Location";
import React, {useEffect, useState} from "react";
import "./Home.css";
import SwipeableViews from "react-swipeable-views";
import {View, Text, StyleSheet} from "react-native";

import ColorPalette from "./ColorPalette";


function Home(){
    const [slideIndex, setSlideIndex] = useState(0);

    const [matches, setMatches] = useState(
        window.matchMedia("all and (max-width:850px)").matches
      )

    useEffect(() => {
       window.matchMedia("all and (max-width:850px)").addEventListener('change', e => {
           setMatches( e.matches )
           setSlideIndex(0)
       });
    }, []);

    const handleSwitch = (index, type) => {
        setSlideIndex(index)
    }

    return (
        <SwipeableViews enableMouseEvents disabled={!matches} index={slideIndex} onChangeIndex={handleSwitch} className="home">
            <View style={styles.location1}>
                <View style={{width: matches ? "100%" : "calc(100% - 4px)"}}>
                    <Location location = "brandywine"/>
                </View>
                {matches ? null : <View style={styles.columnDivider}/>}
            </View>
            <Location location = "anteatery"/>
        </SwipeableViews>
    )
}


const styles = StyleSheet.create({
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