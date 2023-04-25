import Location from "./Location";
import React from "react";
import "./Home.css";
import SwipeableViews from "react-swipeable-views";


function Home(){
    return (
        <SwipeableViews enableMouseEvents className="home">
            <Location location = "brandywine"/>
            <Location location = "anteatery"/>
        </SwipeableViews>
    )
}
export default Home