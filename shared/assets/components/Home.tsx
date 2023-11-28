import Location from "./Location";
import React, {useEffect, useState} from "react";
import "./Home.css";
import {View, Image, StyleSheet, Pressable, } from "react-native";

import ColorPalette from "./ColorPalette";


function Home(){
    const [smallView, setSmallView] = useState(
        window.matchMedia("all and (max-width:850px)").matches
      )

    useEffect(() => {
        window.matchMedia("all and (max-width:850px)").addEventListener('change', e => {
            setSmallView( e.matches )
        });
    }, []);

    //<SwipeableViews enableMouseEvents disabled={!matches} index={slideIndex} onChangeIndex={handleSwitch} className="home">
    //</SwipeableViews>

    return (
        <MainSwipeView disabled={!smallView}>
            <View style={styles.location1}>
                <View style={{width: smallView ? "100%" : "calc(100% - 4px)"}}>
                    <Location location = "brandywine"/>
                </View>
                {smallView ? null : <View style={styles.columnDivider}/>}
            </View>
            <Location location = "anteatery"/>
        </MainSwipeView>
    )
}

function MainSwipeView(props: {children: Element[], disabled: boolean, mobileView: boolean}) {

    const [slideIndex, setSlideIndex] = useState(0);

    function swipeRight()
    {
        setSlideIndex(1)
    }

    function swipeLeft()
    {
        setSlideIndex(0)
    }

    useEffect(() => {
        if (props.disabled)
        {
            setSlideIndex(0)
        }
     });

    return (
        <View style={{overflow: "hidden"}}>
            {props.disabled ? null : 
                <View style={styles.swipeButtonCard}>
                    <Pressable style={[styles.swipeButton, {opacity: (slideIndex == 1 ? "100%" : "0")}]} onPress={swipeLeft}>
                        <Image source={"imageAssets/Icons/left-arrow-white.png"} style={{width: "100%", height: "100%"}}/>
                    </Pressable>
                    <Pressable style={[styles.swipeButton, {opacity: (slideIndex == 0 ? "100%" : "0")}]} onPress={swipeRight}>
                        <Image source={"imageAssets/Icons/right-arrow-white.png"} style={{width: "100%", height: "100%"}}/>
                    </Pressable>
                </View>
            }

            <View style={[styles.swipeView, {transform: "translateX(" + (-slideIndex * 100) + "%)"}]}>
                {props.children.map((child: Element) => {
                    return (<View style={{width: (props.disabled ? "50%" : "100%")}}>
                        {child}
                    </View>)
                })}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    swipeButtonCard: {
        position: "absolute",
        width: "100%",
        minHeight: "150px",
        aspectRatio: "9 / 2",
        zIndex: 2,
        
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "8%"
    },

    swipeButton: {
        width: "70px",
        height: "70px",
        transition: "all 0.3s"
    },

    swipeView: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        backgroundColor: ColorPalette.bgColor,
        transition: "all 0.5s"
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