//import './Location.css'
import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Button, Linking, ImageBackground, Image} from "react-native";
import Station from "./meal-info/Station";
import {LocationInfo, StationInfo} from "../../shared/lib/zotmeal.types";
import ColorPalette from "./ColorPalette";
import PricingButton from "./location-info/Pricing";
import ScheduleButton from "./location-info/Schedule";
import location from "zotmeal-vite/components/Location";

//import json from './brandywine.json'

/*
 * Displays the API results for a given location
 * Takes 1 parameter: location (string)
 */

function hasKeys(object: Object){
    return Object.keys(object).length > 0
}

function Location(props: {location : string}){

    const [locationInfo, setLocationInfo] = useState({})

    const baseURL = "https://zotmeal-backend.vercel.app/api?location="

    //Fetch data from API
    useEffect(() => {
        const fetchData = async (location: string) => {
            const response = await fetch(baseURL + location)
            const json = await response.json()
            setLocationInfo(json)
        }

        //Only fetch the data if locationInfo is empty
        if(hasKeys(locationInfo)) {return}

        fetchData(props.location)
    })

    //Only show stations once data has been retrieved
    let stationInfo: JSX.Element[] = []
    let loadingMessage = "Loading . . ."
    if (hasKeys(locationInfo))
    {
        loadingMessage = ""
        locationInfo.all.forEach((station: StationInfo) => {
            stationInfo.push(<Station key={station.station} info={station}/>)
        })
    }

    const hasColDiv = (props.location == "brandywine")
    //Display HTML
    return (
        <View style={styles.location}>
            <View style={{width: hasColDiv ? "calc(100% - 4px)" : "100%"}}>
                <LocationHeader locationInfo={locationInfo}/>
                <View style={styles.stationList}>
                    <Text>{loadingMessage}</Text>
                    {stationInfo}
                </View>
            </View>
            <View style={[styles.columnDivider, {width: hasColDiv ? "4px" : "0px"}]}></View>
        </View>
    )
}

function LocationHeader(props: {locationInfo: LocationInfo}){
    const info = props.locationInfo
    let currMeal = info.currentMeal
    let location = info.restaurant

    if(location)
        location = location.charAt(0).toUpperCase() + location.slice(1)

    if (currMeal)
        {currMeal = currMeal.charAt(0).toUpperCase() + currMeal.slice(1)}

    let locationUrl = "https://www.google.com/maps/search/uci+"

    return(
        <ImageBackground source={"components/imageAssets/" + location + ".imageset/" + location + ".jpg"}
                             style={headerStyles.locationImage}>

            <View style={headerStyles.locationNav}>
                {currMeal ?
                    <View style={headerStyles.navSide}>
                        <View style={headerStyles.statusCircleGreen}/>
                        <Text style={headerStyles.navText}>Open | {currMeal} | ${info.price[info.currentMeal]}</Text>
                    </View>
                    : <View style={headerStyles.navSide}>
                        <View style={headerStyles.statusCircleRed}/>
                        <Text style={headerStyles.navText}>Closed</Text>
                    </View>}

                <View style={headerStyles.navSide}>
                    <ScheduleButton locationInfo={info}/>
                    <PricingButton locationInfo={info}/>
                    <Button onPress={() => Linking.openURL(locationUrl + info.restaurant)}></Button>
                </View>
            </View>


            <Text style={headerStyles.locationTitle}>
                {info.restaurant}
            </Text>
        </ImageBackground>
    )
}

// "CSS" Styling
const styles = StyleSheet.create({
    location: {
        flexDirection: "row",
        height: "100%"
    },

    stationList: {
        display: "flex",
        flexDirection: "column",
        padding: "5%",
        paddingTop: 0,
        backgroundColor: ColorPalette.bgColor,
        color: "white",
    },

    columnDivider: {
        backgroundColor: ColorPalette.textColor
    }
})

const headerStyles = StyleSheet.create({
    locationImage: {
        width: "100%",
        height: "150px",
        justifyContent: "space-batween"
    },

    locationTitle: {
        padding: "3%",
        paddingTop: "6%",
        fontSize: 35,
        fontWeight: "bold",
        color: "white",
    },

    locationNav: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "2%",
    },

    navSide: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },

    navText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 16,
    },

    statusCircleGreen: {
        borderRadius: 6,
        backgroundColor: "#00FF00",
        width: 12,
        height: 12,
    },

    statusCircleRed: {
        borderRadius: 6,
        backgroundColor: "#FF0000",
        width: 12,
        height: 12,
    },
})

export default Location