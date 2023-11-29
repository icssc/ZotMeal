import { Text, Linking,Image, Pressable} from "react-native";
import React from "react";

const feedbackform = 'https://forms.gle/Lwhg4qswRjb1VyXi8'


function FeedbackButton() {
    // 
    return (
        <Pressable onPress={() => Linking.openURL(feedbackform)}>
            <Image source='imageAssets/Icons/feedback-icon.png' style={{
                height: "29px", width: "29px",
                marginTop: "5px", marginRight: "8px", marginBottom: "4px"
            }} />
        </Pressable>

    )
}
export default FeedbackButton