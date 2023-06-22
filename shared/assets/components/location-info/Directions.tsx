import { Text, Linking,Image, Pressable} from "react-native";
import React from "react";

const locationUrl = "https://www.google.com/maps/search/uci+"

function DirectionsButton(props: {location: string}) {
    return (
        <Pressable onPress={() => Linking.openURL(locationUrl + props.location)}>
            <Image source="imageAssets/Icons/address.png" style={{height: "33px", width: "33px"}}/>
        </Pressable>
    )
}

export default DirectionsButton