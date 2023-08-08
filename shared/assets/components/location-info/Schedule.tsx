import {Button, View, StyleSheet, TouchableWithoutFeedback,
    Pressable, Modal, Text, Image} from "react-native";
import React, {useState} from "react";
import {LocationInfo} from "../../../lib/zotmeal.types";
import ColorPalette from "../ColorPalette";


function ScheduleButton(props: {locationInfo: LocationInfo}) {
    const [scheduleOpen, openSchedule] = useState(false)
    return (
        <View>
            <Pressable onPress={() => {openSchedule(true)}}>
                <Image source="imageAssets/Icons/calendar.png" style={{height: "40px", width: "40px"}}/>
            </Pressable>

            <Modal visible={scheduleOpen} transparent={true} animationType={"fade"}>
                <Pressable style={modalStyles.backgroundFilter} onPress={() => openSchedule(false)}>
                    <View style={modalStyles.modalView}>

                        {/* Inside the modal */}
                        <View style={modalStyles.modalHeader}>
                            <Pressable onPress={() => openSchedule(false)} style={{width: "5%"}}>
                                <Text style={modalStyles.exitButton}>X</Text>
                            </Pressable>
                            <Text style={modalStyles.pricingTitle}>Calendar</Text>
                            <View style={{width: "10%"}}></View>
                        </View>
                        <TouchableWithoutFeedback>
                            <ScheduleModal locationInfo={props.locationInfo}/>
                        </TouchableWithoutFeedback>

                    </View>
                </Pressable>
            </Modal>
        </View>
    )
}

function ScheduleModal(props: {locationInfo: LocationInfo}) {
    const info = props.locationInfo
    const schedule = info.schedule
    // Sort the meals in order of start time
    const mealNames = Object.keys(schedule).sort(
        (meal1: string, meal2: string) => schedule[meal1].start - schedule[meal2].start)

    // For styling the first meal differently
    let mealCount = 0

    return (
        <View style={{margin: "3%"}}>
            <View style={modalStyles.tempImage}>
                <View style={modalStyles.overlayTitle}>
                    <Text style={modalStyles.locationTitle}>{info.restaurant}</Text>
                    <View style={modalStyles.rowDivider}/>
                    <Text style={modalStyles.smallText}>Calendar Updated: {info.date}</Text>
                </View>
            </View>

            {/* Schedule table */}
            <View style={modalStyles.scheduleTable}>

                {mealNames.map((meal: string) => {
                    // Formatting meal name and time
                    const mealName = meal.charAt(0).toUpperCase() + meal.slice(1)
                    const start = schedule[meal].start
                    const end = schedule[meal].end
                    let startDisplay = ""
                    let endDisplay = ""

                    // Get hours and minutes
                    const startHr = Math.floor(start / 100)
                    const endHr = Math.floor(end / 100)
                    const startMin = start.toString().slice(-2)
                    const endMin = end.toString().slice(-2)

                    // Use 12 hr time
                    startDisplay += (startHr > 12) ? (startHr - 12) : startHr
                    endDisplay += (endHr > 12) ? (endHr - 12) : endHr

                    startDisplay += ":" + startMin
                    endDisplay += ":" + endMin

                    startDisplay += (startHr > 12) ? " pm" : " am"
                    endDisplay += (endHr > 12) ? " pm" : " am"


                {/* One meal */}
                    return (
                    <View>
                        <View style={[modalStyles.mealNameSection, mealCount++ ? {borderRadius: 0} : null]}>
                            <Text style={modalStyles.mealName}>{mealName}</Text>
                        </View>
                        <View style={modalStyles.rowDivider}/>
                        <View style={modalStyles.twoColumn}>
                            <Text style={modalStyles.mealTime}>Start</Text>
                            <Text style={modalStyles.mealTime}>{startDisplay}</Text>
                        </View>
                        <View style={modalStyles.rowDivider}/>
                        <View style={modalStyles.twoColumn}>
                            <Text style={modalStyles.mealTime}>End</Text>
                            <Text style={modalStyles.mealTime}>{endDisplay}</Text>
                        </View>
                    </View>)
                })}
            </View>
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

    mealNameSection: {
        alignItems: "center",
        backgroundColor: ColorPalette.bgColorBlue,
        borderTopRightRadius: 9,
        borderTopLeftRadius: 9,
        padding: "1%",
    },

    mealName: {
        color: ColorPalette.textColor,
            fontSize: 20,
        fontWeight: "bold",
    },

    mealTime: {
        color: ColorPalette.textColor,
        fontSize: 18,
        fontWeight: "bold",
    },

    rowDivider: {
        height: 2,
        backgroundColor: ColorPalette.rowDivider
    },

    twoColumn: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "2%",
    },

    scheduleTable: {
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: ColorPalette.rowDivider,
        marginTop: "2%",
        maxHeight: "65vh",
        overflowY: "scroll",
    },
})

export default ScheduleButton