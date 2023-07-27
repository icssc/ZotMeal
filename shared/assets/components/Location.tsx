//import './Location.css'
import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Pressable, Linking, ImageBackground, Image} from "react-native";
import Station from "./meal-info/Station";
import {LocationInfo, StationInfo} from "../../lib/zotmeal.types";
import ColorPalette from "./ColorPalette";
import PricingButton from "./location-info/Pricing";
import ScheduleButton from "./location-info/Schedule";
import location from "zotmeal-vite/components/Location";
import FeedbackButton from "./location-info/FeedbackButton";
import DirectionsButton from "./location-info/Directions"
import ErrorMessage from "./location-info/ErrorMessage"

import jsonFile from './brandywine.json'

// Control whether to use json file or API data
const useBackupJsonData = false;

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

    let hadSuccessLoading = false

    //Fetch data from API
    useEffect(() => {
        const fetchData = async (location: string) => {
            // Fetch data or use local json file
            let json = null
            if (useBackupJsonData) {
                json = jsonFile
            }
            else {
                const response = await fetch(baseURL + location)
                json = await response.json()
            }

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

        // Check if there is an error loading
        let location = locationInfo.restaurant
        if (location) {
            const firstStation = locationInfo.all[0].station
            hadSuccessLoading = !firstStation.includes("Error")
            location = location.charAt(0).toUpperCase() + location.slice(1)
        }
    }

    //Display HTML
    return (
        <View style={styles.location}>
            <View style={{width: "100%"}}>
                <LocationHeader locationInfo={locationInfo}/>
                { hadSuccessLoading ?
                    <View style={styles.stationList}>
                        <Text>{loadingMessage}</Text>
                        {stationInfo}
                    </View>
                    :
                    <ErrorMessage/>
                }
            </View>
        </View>
    )
}

function LocationHeader(props: {locationInfo: LocationInfo}){
    const info = props.locationInfo
    let currMeal = info.currentMeal
    let location = info.restaurant
    let hadSuccessLoading = false

    // Check if there is an error loading
    if (location) {
        const firstStation = info.all[0].station
        hadSuccessLoading = !firstStation.includes("Error")
        location = location.charAt(0).toUpperCase() + location.slice(1)
    }

    // Capitalizes current meal name
    if (hadSuccessLoading && currMeal)
        {currMeal = currMeal.charAt(0).toUpperCase() + currMeal.slice(1)}

    return(
        <ImageBackground source={"imageAssets/" + location + ".imageset/" + location + ".jpg"}
                             style={headerStyles.locationImage}>

            <View style={headerStyles.locationNav}>
                {/* If it successfully loaded and has a current meal, display it
                    Otherwise, display it as closed */}
                {hadSuccessLoading && currMeal ?
                    <View style={headerStyles.navSide}>
                        <View style={headerStyles.statusCircleGreen}/>
                        <Text style={headerStyles.navText}>Open | {currMeal} | ${info.price[info.currentMeal]}</Text>
                    </View>
                    : <View style={headerStyles.navSide}>
                        <View style={headerStyles.statusCircleRed}/>
                        <Text style={headerStyles.navText}>Closed</Text>
                    </View>}

                <View style={headerStyles.navSide}>
                    <FeedbackButton />
                    <ScheduleButton locationInfo={info}/>
                    <PricingButton locationInfo={info}/>
                    <DirectionsButton location={info.restaurant}/>
                </View>
            </View>

            <View style={headerStyles.locationTitleDiv}>
                <Text style={headerStyles.locationTitle}>{info.restaurant}</Text>
                <Text style={headerStyles.locationMenuUpdated}>Menu Updated: {info.date}</Text>
            </View>
        </ImageBackground>
    )
}

// "CSS" Styling
const styles = StyleSheet.create({
    location: {
        display: "block",
        height: "100%"
    },

    stationList: {
        display: "flex",
        flexDirection: "column",
        padding: "5%",
        paddingTop: 0,
        backgroundColor: ColorPalette.bgColor,
        color: "white",
        minHeight: "100%",
    },

    columnDivider: {
        backgroundColor: ColorPalette.textColor
    }
})

const headerStyles = StyleSheet.create({
    locationImage: {
        maxWidth: "100%",
        aspectRatio: "9/2",
        minHeight: "150px",
        justifyContent: "space-between",
    },

    locationTitleDiv: {
        padding: "15px",
        paddingLeft: "5%",
    },

    locationTitle: {
        fontSize: 35,
        fontWeight: "bold",
        color: "white",
        textShadow: "2px 2px 5px #000000",
    },

    locationMenuUpdated: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        textShadow: "2px 2px 5px #000000",
    },

    locationNav: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "2%",
        paddingTop: "0.5%",
        paddingBottom: "0.5%",
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