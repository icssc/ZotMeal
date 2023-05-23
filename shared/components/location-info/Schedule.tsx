import {Button, View, StyleSheet, TouchableWithoutFeedback,
    Pressable, Modal, Text} from "react-native";
import React, {useState} from "react";
import {LocationInfo} from "../../../shared/lib/zotmeal.types";
import ColorPalette from "../ColorPalette";


function ScheduleButton(props: {locationInfo: LocationInfo}) {
    const [scheduleOpen, openSchedule] = useState(false)
    return (
        <View>
            <Button onPress={() => {openSchedule(true)}}></Button>

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

                    // Split hours and mins
                    let startMin = start % 100
                    let startHr = ((start - startMin) / 100)
                    let endMin = end % 100
                    let endHr = ((end - endMin) / 100)

                    // Use 12 hr time
                    const startModifier = (startHr > 12) ? " pm" : " am"
                    const endModifier = (endHr > 12) ? " pm" : " am"

                    startHr = (startHr > 12) ? startHr - 12 : startHr
                    endHr = (endHr > 12) ? endHr - 12 : endHr

                    let startDisplay = startHr + ":"
                    let endDisplay = endHr + ":"

                    // Add zero to start of single digit minutes
                    startDisplay += (startMin < 10) ? "0" + startMin : startMin
                    endDisplay += (endMin < 10) ? "0" + endMin : endMin

                {/* One meal */}
                    return (
                    <View>
                        <View style={[modalStyles.mealNameSection, mealCount++ ? {borderRadius: 0} : null]}>
                            <Text style={modalStyles.mealName}>{mealName}</Text>
                        </View>
                        <View style={modalStyles.rowDivider}/>
                        <View style={modalStyles.twoColumn}>
                            <Text style={modalStyles.mealTime}>Start</Text>
                            <Text style={modalStyles.mealTime}>{startDisplay + startModifier}</Text>
                        </View>
                        <View style={modalStyles.rowDivider}/>
                        <View style={modalStyles.twoColumn}>
                            <Text style={modalStyles.mealTime}>End</Text>
                            <Text style={modalStyles.mealTime}>{endDisplay + endModifier}</Text>
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
    },
})

export default ScheduleButton