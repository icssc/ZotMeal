import Location from "./Location";
import React from "react";
import {View} from "react-native"
import "./Home.css"
function Home(){
    return (
        <div className="home">
            <Location location = "brandywine"/>
            <Location location = "anteatery"/>
        </div>
    )
}
export default Home