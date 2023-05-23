import {Button, View, StyleSheet, TouchableWithoutFeedback,
    Pressable, Modal, Text} from "react-native";
import React, {useState} from "react";
import {LocationInfo} from "../../lib/zotmeal.types";
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
                        <View style={modalStyles.modalHeader}>
                            <Pressable onPress={() => openPricing(false)} style={{width: "5%"}}>
                                <Text style={modalStyles.exitButton}>X</Text>
                            </Pressable>
                            <Text style={modalStyles.pricingTitle}>Pricing</Text>
                            <View style={{width: "10%"}}></View>
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
    const info = props.locationInfo

    return (
        <View style={{margin: "3%"}}>
            <View style={modalStyles.tempImage}>
                <View style={modalStyles.overlayTitle}>
                    <Text style={modalStyles.locationTitle}>{info.restaurant}</Text>
                    <View style={modalStyles.rowDivider}/>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={modalStyles.smallText}>Meal Type</Text>
                        <Text style={modalStyles.smallText}>Price</Text>
                    </View>
                </View>
            </View>

            <View style={modalStyles.priceTable}>
                <Text style={modalStyles.mealName}>Breakfast</Text>
                <Text style={modalStyles.mealPrice}>${info.price["breakfast"]}</Text>
            </View>
            <View style={modalStyles.rowDivider}/>
            <View style={modalStyles.priceTable}>
                <Text style={modalStyles.mealName}>Lunch (Mon. - Fri. only)</Text>
                <Text style={modalStyles.mealPrice}>${info.price["lunch"]}</Text>
            </View>
            <View style={modalStyles.rowDivider}/>
            <View style={modalStyles.priceTable}>
                <Text style={modalStyles.mealName}>Brunch (Sat. - Sun. only)</Text>
                <Text style={modalStyles.mealPrice}>${info.price["brunch"]}</Text>
            </View>
            <View style={modalStyles.rowDivider}/>
            <View style={modalStyles.priceTable}>
                <Text style={modalStyles.mealName}>Dinner</Text>
                <Text style={modalStyles.mealPrice}>${info.price["dinner"]}</Text>
            </View>
            <View style={modalStyles.rowDivider}/>
            <Text style={{margin: "2%"}}>Meal plan holders: Please refer to terms and conditions of your specific meal plan.</Text>
        </View>
    )
}

const modalStyles = StyleSheet.create({
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    pricingTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },

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

    // Inside the PricingModal function
    tempImage: {
        height: 100,
        flexDirection: "row",
        alignItems: "end",
    },

    overlayTitle: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "2%",
    },

    locationTitle: {
        color: ColorPalette.bgColor,
        fontSize: 28,
        fontWeight: "bold"
    },

    smallText: {
        color: ColorPalette.bgColor,
        fontSize: 16,
    },

    mealName: {
        color: ColorPalette.textColor,
        fontSize: 18,
        fontWeight: "bold",
    },

    mealPrice: {
        color: "#00DD11",
        fontSize: 18,
        fontWeight: "bold",
    },

    rowDivider: {
        height: 2,
        backgroundColor: ColorPalette.rowDivider
    },

    priceTable: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "2%"
    }
})

export default PricingButton