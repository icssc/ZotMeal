import {Button, View, StyleSheet, TouchableWithoutFeedback,
    Pressable, Modal, Text} from "react-native";
import React, {useState} from "react";
import {LocationInfo} from "../typedef";
import ColorPalette from "../ColorPalette";


function PricingButton(props: {locationInfo: LocationInfo}) {
    const [pricingOpen, openPricing] = useState(false)
    return (
        <View>
            <Button onPress={() => {openPricing(true)}}></Button>

            <Modal visible={pricingOpen} transparent={true} animationType={"fade"}>
                <Pressable style={modalStyles.backgroundFilter} onPress={() => openPricing(false)}>
                    <View style={modalStyles.modalView}>

                        {/* Inside the modal */}
                        <View style={{alignItems: "right"}}>
                            <Pressable onPress={() => openPricing(false)} style={{width: "5%"}}>
                                <Text style={modalStyles.exitButton}>X</Text>
                            </Pressable>
                        </View>
                        <TouchableWithoutFeedback>
                            <PricingModal locationInfo={props.locationInfo}/>
                        </TouchableWithoutFeedback>

                    </View>
                </Pressable>
            </Modal>
        </View>
    )
}

function PricingModal(props: {locationInfo: LocationInfo}) {
    return (
        <View>
            
        </View>
    )
}

const modalStyles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: ColorPalette.bgColor,
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: "90%",
        minWidth: "50%",
    },

    backgroundFilter: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: "center",
    },

    centerView: {
        alignItems: 'center',
    },

    exitButton: {
        color: ColorPalette.textColor,
        fontWeight: "bold",
    },

    white: {
        color: ColorPalette.bgColor
    },
})

export default PricingButton