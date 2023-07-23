import Location from "./Location";
import React, {useEffect, useState} from "react";
import "./Home.css";
import SwipeableViews from "react-swipeable-views";


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
            <Location location = "brandywine"/>
            <Location location = "anteatery"/>
        </SwipeableViews>
    )
}
export default Home