//import './Location.css'
import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import Station from "./meal-info/Station";
import {LocationInfo, StationInfo} from "./typedef";
import ColorPalette from "./ColorPalette";
import PricingButton from "./location-info/Pricing";

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

    //Display HTML
    return (
        <View style={styles.location}>
            <LocationHeader locationInfo={locationInfo}/>
            <View style={styles.stationList}>
                <Text>{loadingMessage}</Text>
                {stationInfo}
            </View>
        </View>
    )
}

function LocationHeader(props: {locationInfo: LocationInfo}){
    const info = props.locationInfo
    let currMeal = info.currentMeal
    if (currMeal)
        {currMeal = currMeal.charAt(0).toUpperCase() + currMeal.slice(1)}

    return(
        <View style={headerStyles.locationHeader}>

            <View style={headerStyles.locationNav}>
                {currMeal ?
                    <View style={headerStyles.navSide}>
                        <View style={headerStyles.statusCircle}></View>
                        <Text style={headerStyles.navText}>Open</Text>
                        <Text style={headerStyles.navText}>|</Text>
                        <Text style={headerStyles.navText}>{currMeal}</Text>
                        <Text style={headerStyles.navText}>|</Text>
                        <Text style={headerStyles.navText}>${info.price[info.currentMeal]}</Text>
                    </View>
                    : null}

                <View style={headerStyles.navSide}>
                    <Button>lol</Button>
                    <PricingButton locationInfo={info}/>
                    <Button>lol</Button>
                </View>
            </View>

            <Text style={headerStyles.locationTitle}>
                {info.restaurant}
            </Text>

        </View>
    )
}

// "CSS" Styling
const styles = StyleSheet.create({
    location: {
        color: "white"
    },

    stationList: {
        display: "flex",
        flexDirection: "column",
        padding: "5%",
        backgroundColor: ColorPalette.bgColor,
        color: "white",
    }
})

const headerStyles = StyleSheet.create({
    locationHeader: {
        backgroundColor: "#242424",
    },

    locationTitle: {
        padding: "3%",
        paddingTop: "6%",
        fontSize: 30,
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
    },

    statusCircle: {
        borderRadius: 6,
        backgroundColor: "#00FF00",
        width: 12,
        height: 12,
    },
})

export default Location