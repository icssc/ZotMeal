//import './Location.css'
import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import Station from "./meal-info/Station";

/*
 * Displays the API results for a given location
 * Takes 1 parameter: location (string)
 */
function hasKeys(object: Object){
    return Object.keys(object).length > 0
}

function Location(props: any){

    const [locationInfo, setLocationInfo] = useState({})

    const baseURL = "https://zotmeal-backend.vercel.app/api?location="

    //Fetch data from API
    useEffect(() => {
        const fetchData = async (location: string) => {
            //const response = await fetch('src/components/' + location + '.json')
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
        locationInfo.all.forEach((station: Object) => {
            stationInfo.push(<Station key={station.station} info={station}/>)
        })
    }

    //Display HTML
    return (
        <View style={styles.location}>
            <Text style={styles.locationHeader}>
                {locationInfo.restaurant}
            </Text>
            <View style={styles.stationList}>
                <Text>{loadingMessage}</Text>
                {stationInfo}
            </View>
        </View>
    )
}

// "CSS" Styling
const styles = StyleSheet.create({
    location: {
        color: "white"
    },

    locationHeader: {
        marginTop: "2%",
        marginRight: "1%",
        marginBottom: "2%",
        marginLeft: "1%",
        paddingTop: "5%",
        paddingRight: "5%",
        paddingBottom: "5%",
        paddingLeft: "5%",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#242424",
        fontSize: "24",
        color: "white",
    },

    stationList: {
        display: "flex",
        flexDirection: "column",
        marginTop: "2%",
        marginRight: "1%",
        marginBottom: "2%",
        marginLeft: "1%",
        padding: "5%",
        backgroundColor: "#242424",
        color: "white",
    }
})

export default Location