import './Location.css'
import React, {useEffect, useState} from "react";
import Station from "./meal-info/Station"

/**
 * Displays the API results for a given location
 * Takes 1 parameter: location (string)
 */

let mealData : any = {}

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
        <div className = "location">
            <div className="locationHeader">
                <p> {locationInfo.restaurant} </p>
            </div>
            <div className="stationList">
                {loadingMessage}
                {stationInfo}
            </div>
        </div>
    )
}
export default Location